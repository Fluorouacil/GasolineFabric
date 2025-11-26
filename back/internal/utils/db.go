package utils

import (
	"GasolineFabric/internal/models"
	"fmt"
	"reflect"
	"time"

	"github.com/google/uuid"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

// SafeCreate создаёт запись, обнуляя поля BaseModel перед вставкой
func SafeCreate[T any](db *gorm.DB, item *T) error {
	v := reflect.ValueOf(item).Elem()
	if v.Kind() != reflect.Struct {
		return gorm.ErrInvalidValue
	}

	baseField := v.FieldByName("BaseModel")
	if baseField.IsValid() && baseField.Kind() == reflect.Struct {
		setField(baseField, "UUID", uuid.UUID{})
		setField(baseField, "CreatedAt", time.Time{})
		setField(baseField, "UpdatedAt", time.Time{})
		setField(baseField, "DeletedAt", gorm.DeletedAt{})
	}

	return db.Create(item).Error
}

func DeleteByUUID[T any](db *gorm.DB, uuidStr string) error {
	parsedUUID, err := uuid.Parse(uuidStr)
	if err != nil {
		return err
	}

	var item T
	if err := db.Where("uuid = ?", parsedUUID).First(&item).Error; err != nil {
		return err
	}

	if err := db.Delete(&item).Error; err != nil {
		return err
	}

	return nil
}

func setField(structVal reflect.Value, fieldName string, value interface{}) {
	field := structVal.FieldByName(fieldName)
	if field.IsValid() && field.CanSet() {
		field.Set(reflect.ValueOf(value))
	}
}

// FindByUUID ищет запись по UUID
func FindByUUID[T any](db *gorm.DB, uuidStr string) (*T, error) {
	parsedUUID, err := uuid.Parse(uuidStr)
	if err != nil {
		return nil, err
	}

	var item T
	result := db.Where("uuid = ?", parsedUUID).First(&item)
	return &item, result.Error
}

// FindByUUIDWithPreload ищет запись по UUID и предзагружает указанные связи
func FindByUUIDWithPreload[T any](db *gorm.DB, uuidStr string, preloadFields ...string) (*T, error) {
	parsedUUID, err := uuid.Parse(uuidStr)
	if err != nil {
		return nil, err
	}

	var item T
	query := db.Where("uuid = ?", parsedUUID)

	// Применяем Preload для каждого указанного поля
	for _, field := range preloadFields {
		query = query.Preload(field)
	}

	result := query.First(&item)
	return &item, result.Error
}

// SafeUpdate обновляет запись, защищая поля BaseModel
func SafeUpdate[T any](db *gorm.DB, uuidStr string, updates map[string]interface{}) error {
	parsedUUID, err := uuid.Parse(uuidStr)
	if err != nil {
		return err
	}

	var existing T
	if err := db.Where("uuid = ?", parsedUUID).First(&existing).Error; err != nil {
		return err
	}

	protectedFields := []string{"UUID", "CreatedAt", "DeletedAt", "uuid", "created_at", "deleted_at"}
	for _, field := range protectedFields {
		delete(updates, field)
	}

	if err := db.Model(&existing).Updates(updates).Error; err != nil {
		return err
	}

	return nil
}

// extractUUID извлекает UUID из структуры, содержащей BaseModel
func extractUUID(item interface{}) (uuid.UUID, error) {
	v := reflect.ValueOf(item)
	if v.Kind() == reflect.Ptr {
		v = v.Elem()
	}
	if v.Kind() != reflect.Struct {
		return uuid.Nil, gorm.ErrInvalidValue
	}

	baseField := v.FieldByName("BaseModel")
	if !baseField.IsValid() || baseField.Kind() != reflect.Struct {
		return uuid.Nil, gorm.ErrInvalidValue
	}

	uuidField := baseField.FieldByName("UUID")
	if !uuidField.IsValid() || !uuidField.Type().AssignableTo(reflect.TypeOf(uuid.UUID{})) {
		return uuid.Nil, gorm.ErrInvalidValue
	}

	uuidVal, ok := uuidField.Interface().(uuid.UUID)
	if !ok {
		return uuid.Nil, gorm.ErrInvalidValue
	}

	return uuidVal, nil
}

// InitDB инициализирует базу данных
func InitDB() *gorm.DB {
	db, err := gorm.Open(postgres.Open("host=localhost user=GasolineAdmin password=admin dbname=GasolineFabric TimeZone=Europe/Samara"))
	if err != nil {
		fmt.Println(err)
	}

	db.AutoMigrate(&models.BaseModel{}, &models.Person{}, &models.Employee{}, &models.Equipment{}, &models.Department{}, &models.EquipmentType{}, &models.VerificationHistory{}, &models.EquipmentStatus{})

	return db
}
