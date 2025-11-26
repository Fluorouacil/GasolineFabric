package utils

import (
	"encoding/json"
	"errors"
	"net/http"
	"reflect"
	"strconv"
	"strings"

	"github.com/google/uuid"
	"github.com/labstack/echo/v4"
	"gorm.io/gorm"
)

// GenericListHandler возвращает список записей в формате simple-rest
func GenericListHandler[T any](db *gorm.DB) echo.HandlerFunc {
	return func(c echo.Context) error {
		// === Пагинация: _start, _end ================================
		_startStr := c.QueryParam("_start")
		_endStr := c.QueryParam("_end")

		var offset, limit int
		if _startStr != "" && _endStr != "" {
			_start, _ := strconv.Atoi(_startStr)
			_end, _ := strconv.Atoi(_endStr)
			offset = _start
			limit = _end - _start
		} else {
			// Без пагинации → все записи (не рекомендуется для продакшена)
			limit = 10
		}

		// === Сортировка: _sort, _order ==============================
		_sort := c.QueryParam("_sort")
		_order := strings.ToUpper(c.QueryParam("_order")) // ASC / DESC
		if _order != "ASC" && _order != "DESC" {
			_order = "ASC"
		}

		// === Фильтрация ==============================================
		query := db.Model((*T)(nil))

		// 🔹 Глобальный поиск: q=...
		q := c.QueryParam("q")
		if q != "" {
			query = applyGlobalSearch[T](query, q)
		}

		// 🔹 Поля: field_eq, field_ne, field_like, field_lt, field_gt, field_in
		for key, vals := range c.QueryParams() {
			if len(vals) == 0 {
				continue
			}
			val := vals[0]

			switch {
			case strings.HasSuffix(key, "_eq"):
				field := strings.TrimSuffix(key, "_eq")
				if isIdentifier(field) {
					query = query.Where(field+" = ?", val)
				}
			case strings.HasSuffix(key, "_ne"):
				field := strings.TrimSuffix(key, "_ne")
				if isIdentifier(field) {
					query = query.Where(field+" != ?", val)
				}
			case strings.HasSuffix(key, "_lt"):
				field := strings.TrimSuffix(key, "_lt")
				if isIdentifier(field) {
					if n, err := strconv.Atoi(val); err == nil {
						query = query.Where(field+" < ?", n)
					}
				}
			case strings.HasSuffix(key, "_gt"):
				field := strings.TrimSuffix(key, "_gt")
				if isIdentifier(field) {
					if n, err := strconv.Atoi(val); err == nil {
						query = query.Where(field+" > ?", n)
					}
				}
			case strings.HasSuffix(key, "_like"):
				field := strings.TrimSuffix(key, "_like")
				if isIdentifier(field) {
					query = query.Where(field+" ILIKE ?", "%"+val+"%")
				}
			case strings.HasSuffix(key, "_in"):
				field := strings.TrimSuffix(key, "_in")
				if isIdentifier(field) {
					// simple-rest ожидает: field_in=1,2,3
					parts := strings.Split(val, ",")
					if len(parts) > 0 {
						query = query.Where(field+" IN ?", parts)
					}
				}
			}
		}

		// === Сортировка ==============================================
		if _sort != "" && isIdentifier(_sort) {
			query = query.Order(_sort + " " + _order)
		} else {
			// fallback: сортируем по ID или created_at, если есть
			query = query.Order("id ASC")
		}

		// === Подсчёт общего числа записей ===========================
		var total int64
		if err := query.Count(&total).Error; err != nil {
			return c.JSON(http.StatusInternalServerError, echo.Map{"error": "Failed to count records"})
		}

		// === Получение данных ========================================
		var items []T
		qry := query
		if limit >= 0 {
			qry = qry.Offset(offset).Limit(limit)
		}
		if err := qry.Find(&items).Error; err != nil {
			return c.JSON(http.StatusInternalServerError, echo.Map{"error": "Failed to fetch records"})
		}

		// === Заголовок X-Total-Count (обязательно для refine) =======
		c.Response().Header().Set("X-Total-Count", strconv.FormatInt(total, 10))
		return c.JSON(http.StatusOK, items)
	}
}

// applyGlobalSearch ищет `q` по всем строковым полям
func applyGlobalSearch[T any](query *gorm.DB, q string) *gorm.DB {
	var sample T
	t := reflect.TypeOf(sample)

	var conditions []string
	var values []interface{}

	for i := 0; i < t.NumField(); i++ {
		field := t.Field(i)
		ft := field.Type

		// Поддержка *string и string
		if ft.Kind() == reflect.String || (ft.Kind() == reflect.Ptr && ft.Elem().Kind() == reflect.String) {
			colName := getColumnName(field)
			conditions = append(conditions, colName+" ILIKE ?")
			values = append(values, "%"+q+"%")
		}
	}

	if len(conditions) > 0 {
		return query.Where(strings.Join(conditions, " OR "), values...)
	}
	return query
}

// getColumnName извлекает имя колонки из тега gorm или имени поля
func getColumnName(field reflect.StructField) string {
	colName := field.Tag.Get("gorm")
	if colName == "" {
		return field.Name
	}
	// Убираем параметры вроде `type:uuid`, `primaryKey`, `->`
	if idx := strings.IndexAny(colName, " ;"); idx > 0 {
		colName = colName[:idx]
	}
	return colName
}

// GenericGetHandler получает одну запись по ID (UUID)
func GenericGetHandler[T any](db *gorm.DB) echo.HandlerFunc {
	return func(c echo.Context) error {
		idStr := c.Param("id") // ← важно: refine передаёт :id, не :uuid
		if _, err := uuid.Parse(idStr); err != nil {
			return c.JSON(http.StatusBadRequest, echo.Map{"error": "Invalid UUID format"})
		}

		item, err := FindByUUID[T](db, idStr)
		if err != nil {
			if errors.Is(err, gorm.ErrRecordNotFound) {
				return c.JSON(http.StatusNotFound, echo.Map{"error": "Record not found"})
			}
			return c.JSON(http.StatusInternalServerError, echo.Map{"error": "DB error"})
		}

		return c.JSON(http.StatusOK, item)
	}
}

// GenericPostHandler создаёт запись (refine → POST /resource)
func GenericPostHandler[T any](db *gorm.DB) echo.HandlerFunc {
	return func(c echo.Context) error {
		var item T
		if err := c.Bind(&item); err != nil {
			return c.JSON(http.StatusBadRequest, echo.Map{"error": "Invalid JSON"})
		}

		if err := SafeCreate(db, &item); err != nil {
			if strings.Contains(strings.ToLower(err.Error()), "unique") ||
				strings.Contains(strings.ToLower(err.Error()), "duplicate") {
				return c.JSON(http.StatusConflict, echo.Map{"error": "Unique constraint violation"})
			}
			return c.JSON(http.StatusInternalServerError, echo.Map{"error": "Failed to create record"})
		}

		return c.JSON(http.StatusCreated, item)
	}
}

// GenericPatchHandler — частичное обновление (refine → PATCH /resource/:id)
func GenericPatchHandler[T any](db *gorm.DB) echo.HandlerFunc {
	return func(c echo.Context) error {
		idStr := c.Param("id")
		if _, err := uuid.Parse(idStr); err != nil {
			return c.JSON(http.StatusBadRequest, echo.Map{"error": "Invalid UUID"})
		}

		var updates map[string]interface{}
		if err := json.NewDecoder(c.Request().Body).Decode(&updates); err != nil {
			return c.JSON(http.StatusBadRequest, echo.Map{"error": "Invalid JSON"})
		}

		if err := SafeUpdate[T](db, idStr, updates); err != nil {
			if errors.Is(err, gorm.ErrRecordNotFound) {
				return c.JSON(http.StatusNotFound, echo.Map{"error": "Record not found"})
			}
			if strings.Contains(strings.ToLower(err.Error()), "unique") {
				return c.JSON(http.StatusConflict, echo.Map{"error": "Unique constraint violation"})
			}
			return c.JSON(http.StatusInternalServerError, echo.Map{"error": "Update failed"})
		}

		updated, err := FindByUUID[T](db, idStr)
		if err != nil {
			return c.JSON(http.StatusInternalServerError, echo.Map{"error": "Failed to fetch updated record"})
		}

		return c.JSON(http.StatusOK, updated)
	}
}

// GenericDeleteHandler — удаление (refine → DELETE /resource/:id)
func GenericDeleteHandler[T any](db *gorm.DB) echo.HandlerFunc {
	return func(c echo.Context) error {
		idStr := c.Param("id")
		if _, err := uuid.Parse(idStr); err != nil {
			return c.JSON(http.StatusBadRequest, echo.Map{"error": "Invalid UUID"})
		}

		if err := DeleteByUUID[T](db, idStr); err != nil {
			if errors.Is(err, gorm.ErrRecordNotFound) {
				return c.JSON(http.StatusNotFound, echo.Map{"error": "Record not found"})
			}
			return c.JSON(http.StatusInternalServerError, echo.Map{"error": "DB error: " + err.Error()})
		}

		return c.NoContent(http.StatusNoContent)
	}
}

// isIdentifier проверяет, что строка — валидное имя столбца
func isIdentifier(s string) bool {
	if s == "" {
		return false
	}
	for _, r := range s {
		if !((r >= 'a' && r <= 'z') || (r >= 'A' && r <= 'Z') || (r >= '0' && r <= '9') || r == '_') {
			return false
		}
	}
	return true
}
