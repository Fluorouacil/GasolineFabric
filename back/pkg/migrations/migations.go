package migrations

import (
	"crypto/md5"
	"encoding/hex"
	"fmt"
	"log"
	"os"
	"path/filepath"
	"sort"
	"strings"
	"time"

	"gorm.io/gorm"
)

// MigrationRecord хранит информацию о применённой миграции
type MigrationRecord struct {
	ID        uint      `gorm:"primaryKey"`
	Filename  string    `gorm:"uniqueIndex;size:500;not null"`
	Checksum  string    `gorm:"size:32;not null"`
	AppliedAt time.Time `gorm:"not null"`
}

func (MigrationRecord) TableName() string {
	return "schema_migrations"
}

// MigrationOptions настройки применения миграций
type MigrationOptions struct {
	Recursive     bool // Рекурсивный обход директорий
	Force         bool // Применить даже если уже применено
	ChecksumCheck bool // Проверять изменения в уже применённых файлах
	DryRun        bool // Только показать что будет сделано
}

// DefaultOptions возвращает настройки по умолчанию
func DefaultOptions() MigrationOptions {
	return MigrationOptions{
		Recursive:     false,
		Force:         false,
		ChecksumCheck: true,
		DryRun:        false,
	}
}

// ApplySQLMigrations применяет миграции с отслеживанием (обратная совместимость)
func ApplySQLMigrations(db *gorm.DB, dir string, recursive bool) error {
	opts := DefaultOptions()
	opts.Recursive = recursive
	return ApplySQLMigrationsWithOptions(db, dir, opts)
}

// ApplySQLMigrationsWithOptions применяет миграции с расширенными настройками
func ApplySQLMigrationsWithOptions(db *gorm.DB, dir string, opts MigrationOptions) error {
	// Создаём таблицу миграций если её нет
	if err := ensureMigrationTable(db); err != nil {
		return fmt.Errorf("failed to create migrations table: %w", err)
	}

	// Получаем список SQL-файлов
	files, err := listSQLFiles(dir, opts.Recursive)
	if err != nil {
		return fmt.Errorf("failed to list SQL files in %q: %w", dir, err)
	}

	if len(files) == 0 {
		log.Printf("No .sql files found in %q", dir)
		return nil
	}

	log.Printf("Found %d SQL file(s) in %q", len(files), dir)

	// Получаем уже применённые миграции
	applied, err := getAppliedMigrations(db)
	if err != nil {
		return fmt.Errorf("failed to get applied migrations: %w", err)
	}

	var (
		appliedCount  int
		skippedCount  int
		modifiedFiles []string
	)

	for _, file := range files {
		relPath := getRelativePath(dir, file)

		// Читаем содержимое файла
		content, err := os.ReadFile(file)
		if err != nil {
			return fmt.Errorf("failed to read %q: %w", file, err)
		}

		if strings.TrimSpace(string(content)) == "" {
			log.Printf("⚠️  Skipping empty file: %s", relPath)
			continue
		}

		checksum := calculateChecksum(content)

		// Проверяем была ли миграция уже применена
		if record, exists := applied[relPath]; exists {
			if opts.ChecksumCheck && record.Checksum != checksum {
				modifiedFiles = append(modifiedFiles, relPath)
				log.Printf("⚠️  WARNING: %s was modified after being applied!", relPath)
			}

			if !opts.Force {
				log.Printf("⏭️  Skipping (already applied): %s", relPath)
				skippedCount++
				continue
			}
			log.Printf("🔄 Force re-applying: %s", relPath)
		}

		if opts.DryRun {
			log.Printf("🔍 Would apply: %s", relPath)
			continue
		}

		// Применяем миграцию
		if err := applySQLFile(db, file); err != nil {
			return fmt.Errorf("failed to apply %q: %w", relPath, err)
		}

		// Записываем в таблицу миграций
		if err := recordMigration(db, relPath, checksum); err != nil {
			return fmt.Errorf("failed to record migration %q: %w", relPath, err)
		}

		log.Printf("✅ Applied: %s", relPath)
		appliedCount++
	}

	// Итоговая статистика
	if opts.DryRun {
		log.Printf("🔍 Dry run complete. Would apply %d file(s)", len(files)-skippedCount)
	} else {
		log.Printf("✅ Migration complete: %d applied, %d skipped", appliedCount, skippedCount)
	}

	if len(modifiedFiles) > 0 {
		log.Printf("⚠️  WARNING: %d file(s) were modified after being applied: %v",
			len(modifiedFiles), modifiedFiles)
	}

	return nil
}

// GetMigrationStatus возвращает статус всех миграций
func GetMigrationStatus(db *gorm.DB, dir string, recursive bool) error {
	if err := ensureMigrationTable(db); err != nil {
		return err
	}

	files, err := listSQLFiles(dir, recursive)
	if err != nil {
		return err
	}

	applied, err := getAppliedMigrations(db)
	if err != nil {
		return err
	}

	log.Println("Migration Status:")
	log.Println(strings.Repeat("-", 60))

	for _, file := range files {
		relPath := getRelativePath(dir, file)

		content, _ := os.ReadFile(file)
		checksum := calculateChecksum(content)

		if record, exists := applied[relPath]; exists {
			status := "✅ Applied"
			if record.Checksum != checksum {
				status = "⚠️  Modified"
			}
			log.Printf("%s: %s (at %s)", status, relPath,
				record.AppliedAt.Format("2006-01-02 15:04:05"))
		} else {
			log.Printf("⏳ Pending: %s", relPath)
		}
	}

	return nil
}

// RollbackLastMigration откатывает последнюю миграцию
func RollbackLastMigration(db *gorm.DB, dir string) error {
	if err := ensureMigrationTable(db); err != nil {
		return err
	}

	var lastMigration MigrationRecord
	result := db.Order("applied_at DESC").First(&lastMigration)
	if result.Error != nil {
		if result.Error == gorm.ErrRecordNotFound {
			log.Println("No migrations to rollback")
			return nil
		}
		return result.Error
	}

	downFile := strings.TrimSuffix(lastMigration.Filename, ".sql") + ".down.sql"
	downPath := filepath.Join(dir, downFile)

	if _, err := os.Stat(downPath); os.IsNotExist(err) {
		downFile = strings.TrimSuffix(lastMigration.Filename, ".sql") + "_down.sql"
		downPath = filepath.Join(dir, downFile)
	}

	if _, err := os.Stat(downPath); os.IsNotExist(err) {
		return fmt.Errorf("no rollback file found for %s (tried .down.sql and _down.sql)",
			lastMigration.Filename)
	}

	// Выполняем rollback
	if err := applySQLFile(db, downPath); err != nil {
		return fmt.Errorf("rollback failed: %w", err)
	}

	// Удаляем запись о миграции
	if err := db.Delete(&lastMigration).Error; err != nil {
		return fmt.Errorf("failed to delete migration record: %w", err)
	}

	log.Printf("🔙 Rolled back: %s", lastMigration.Filename)
	return nil
}

// ResetMigrations сбрасывает все миграции
func ResetMigrations(db *gorm.DB) error {
	return db.Migrator().DropTable(&MigrationRecord{})
}

func ensureMigrationTable(db *gorm.DB) error {
	return db.AutoMigrate(&MigrationRecord{})
}

func getAppliedMigrations(db *gorm.DB) (map[string]MigrationRecord, error) {
	var records []MigrationRecord
	if err := db.Find(&records).Error; err != nil {
		return nil, err
	}

	result := make(map[string]MigrationRecord, len(records))
	for _, r := range records {
		result[r.Filename] = r
	}
	return result, nil
}

func recordMigration(db *gorm.DB, filename, checksum string) error {
	record := MigrationRecord{
		Filename:  filename,
		Checksum:  checksum,
		AppliedAt: time.Now(),
	}

	return db.Save(&record).Error
}

func calculateChecksum(content []byte) string {
	hash := md5.Sum(content)
	return hex.EncodeToString(hash[:])
}

func getRelativePath(baseDir, fullPath string) string {
	rel, err := filepath.Rel(baseDir, fullPath)
	if err != nil {
		return filepath.Base(fullPath)
	}
	return rel
}

// listSQLFiles возвращает отсортированный список путей к .sql-файлам
// Исключает down-файлы для откатов
func listSQLFiles(dir string, recursive bool) ([]string, error) {
	var files []string

	isUpMigration := func(name string) bool {
		lower := strings.ToLower(name)
		if strings.HasSuffix(lower, ".down.sql") ||
			strings.HasSuffix(lower, "_down.sql") ||
			strings.HasSuffix(lower, "_rollback.sql") {
			return false
		}
		return strings.HasSuffix(lower, ".sql")
	}

	walkFn := func(path string, info os.FileInfo, err error) error {
		if err != nil {
			return err
		}
		if !info.IsDir() && isUpMigration(info.Name()) {
			files = append(files, path)
		}
		return nil
	}

	if recursive {
		if err := filepath.Walk(dir, walkFn); err != nil {
			return nil, err
		}
	} else {
		entries, err := os.ReadDir(dir)
		if err != nil {
			return nil, err
		}
		for _, entry := range entries {
			if !entry.IsDir() && isUpMigration(entry.Name()) {
				files = append(files, filepath.Join(dir, entry.Name()))
			}
		}
	}

	sort.Strings(files)
	return files, nil
}

// applySQLFile читает и выполняет SQL-файл целиком
func applySQLFile(db *gorm.DB, path string) error {
	sqlBytes, err := os.ReadFile(path)
	if err != nil {
		return fmt.Errorf("failed to read file: %w", err)
	}

	query := string(sqlBytes)
	if strings.TrimSpace(query) == "" {
		return nil
	}

	result := db.Exec(query)
	if result.Error != nil {
		return fmt.Errorf("SQL execution error: %w", result.Error)
	}

	rowsAffected := "no rows"
	if result.RowsAffected > 0 {
		rowsAffected = fmt.Sprintf("%d row(s)", result.RowsAffected)
	}
	log.Printf("   → Executed %q (%s affected)", filepath.Base(path), rowsAffected)

	return nil
}
