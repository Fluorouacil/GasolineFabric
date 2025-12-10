package utils

import (
	"encoding/json"
	"fmt"
	"net/http"
	"reflect"
	"strconv"
	"strings"

	"regexp"

	"github.com/labstack/echo/v4"
	"gorm.io/gorm"
)

// GenericListHandler обрабатывает запросы getList и getMany с автоматическим Preload
func GenericListHandler[T any](db *gorm.DB) echo.HandlerFunc {
	return func(c echo.Context) error {
		var items []T
		model := new(T)

		query := applyPreloads[T](db.Model(model))

		ids := c.QueryParams()["id"]
		if len(ids) > 0 {
			if err := query.Where("id IN ?", ids).Find(&items).Error; err != nil {
				return c.JSON(http.StatusInternalServerError, echo.Map{"error": "DB error"})
			}

			return c.JSON(http.StatusOK, echo.Map{
				"data": items,
			})
		}

		q := c.QueryParam("q")
		if q != "" {
			query = applyGlobalSearch[T](query, q)
		}

		queryParams := c.QueryParams()
		for key, vals := range queryParams {
			if len(vals) == 0 {
				continue
			}
			val := vals[0]

			if key == "_start" || key == "_end" || key == "_sort" || key == "_order" || key == "q" || key == "id" || key == "_page" || key == "_perPage" {
				continue
			}

			if isIdentifier(key) {
				query = query.Where(fmt.Sprintf("%s = ?", key), val)
			}
		}

		_sort := c.QueryParam("_sort")
		_order := strings.ToUpper(c.QueryParam("_order"))
		if _sort != "" && isIdentifier(_sort) {
			if _order != "DESC" {
				_order = "ASC"
			}
			query = query.Order(fmt.Sprintf("%s %s", _sort, _order))
		} else {
			query = query.Order("id ASC")
		}

		var total int64
		if err := query.Session(&gorm.Session{}).Count(&total).Error; err != nil {
			return c.JSON(http.StatusInternalServerError, echo.Map{"error": "Count error"})
		}

		_startStr := c.QueryParam("_start")
		_endStr := c.QueryParam("_end")

		offset := 0
		limit := 10

		if _startStr != "" && _endStr != "" {
			_start, _ := strconv.Atoi(_startStr)
			_end, _ := strconv.Atoi(_endStr)
			offset = _start
			limit = _end - _start
		} else if _pageStr := c.QueryParam("_page"); _pageStr != "" {
			page, _ := strconv.Atoi(_pageStr)
			perPage, _ := strconv.Atoi(c.QueryParam("_perPage"))
			if perPage <= 0 {
				perPage = 10
			}
			if page <= 0 {
				page = 1
			}
			offset = (page - 1) * perPage
			limit = perPage
		}

		if err := query.Limit(limit).Offset(offset).Find(&items).Error; err != nil {
			return c.JSON(http.StatusInternalServerError, echo.Map{"error": "Fetch error"})
		}

		setPaginationHeaders(c, offset, limit, total)

		return c.JSON(http.StatusOK, items)
	}
}

// GenericGetHandler возвращает одну запись по ID с Preload.
func GenericGetHandler[T any](db *gorm.DB) echo.HandlerFunc {
	return func(c echo.Context) error {
		id := c.Param("id")
		var item T

		query := applyPreloads[T](db)

		if err := query.First(&item, "id = ?", id).Error; err != nil {
			if err == gorm.ErrRecordNotFound {
				return c.JSON(http.StatusNotFound, echo.Map{"error": "Record not found"})
			}
			return c.JSON(http.StatusInternalServerError, echo.Map{"error": "DB error"})
		}
		return c.JSON(http.StatusOK, item)
	}
}

// GenericPostHandler создаёт новую запись и возвращает её с заполненными связями.
func GenericPostHandler[T any](db *gorm.DB) echo.HandlerFunc {
	return func(c echo.Context) error {
		var item T
		if err := c.Bind(&item); err != nil {
			return c.JSON(http.StatusBadRequest, echo.Map{"error": "Invalid JSON"})
		}

		if err := db.Create(&item).Error; err != nil {
			return handleDBError(c, err)
		}

		val := reflect.ValueOf(item)
		if val.Kind() == reflect.Ptr {
			val = val.Elem()
		}
		idField := val.FieldByName("ID")

		if idField.IsValid() {
			var reloadedItem T
			query := applyPreloads[T](db)
			if err := query.First(&reloadedItem, "id = ?", idField.Interface()).Error; err == nil {
				return c.JSON(http.StatusCreated, reloadedItem)
			}
		}

		return c.JSON(http.StatusCreated, item)
	}
}

// GenericPatchHandler обновляет запись и возвращает полную версию со связями.
func GenericPatchHandler[T any](db *gorm.DB) echo.HandlerFunc {
	return func(c echo.Context) error {
		id := c.Param("id")

		var input map[string]interface{}
		if err := json.NewDecoder(c.Request().Body).Decode(&input); err != nil {
			return c.JSON(http.StatusBadRequest, echo.Map{"error": "Invalid JSON"})
		}

		var item T
		if err := db.First(&item, "id = ?", id).Error; err != nil {
			return c.JSON(http.StatusNotFound, echo.Map{"error": "Record not found"})
		}

		if err := db.Model(&item).Updates(input).Error; err != nil {
			return handleDBError(c, err)
		}

		var reloadedItem T
		query := applyPreloads[T](db)
		query.First(&reloadedItem, "id = ?", id)

		return c.JSON(http.StatusOK, reloadedItem)
	}
}

// GenericDeleteHandler удаляет запись (без изменений, preload тут не нужен).
func GenericDeleteHandler[T any](db *gorm.DB) echo.HandlerFunc {
	return func(c echo.Context) error {
		id := c.Param("id")

		result := db.Where("id = ?", id).Delete(new(T))

		if result.Error != nil {
			return c.JSON(http.StatusInternalServerError, echo.Map{"error": "DB error"})
		}
		if result.RowsAffected == 0 {
			return c.JSON(http.StatusNotFound, echo.Map{"error": "Record not found"})
		}

		return c.JSON(http.StatusOK, echo.Map{"id": id})
	}
}

// applyPreloads автоматически добавляет .Preload() для всех структурных полей модели.
func applyPreloads[T any](db *gorm.DB) *gorm.DB {
	var model T
	t := reflect.TypeOf(model)

	if t.Kind() == reflect.Ptr {
		t = t.Elem()
	}

	for i := 0; i < t.NumField(); i++ {
		field := t.Field(i)
		fieldType := field.Type

		if field.PkgPath != "" {
			continue
		}

		if field.Anonymous {
			continue
		}

		targetType := fieldType
		if targetType.Kind() == reflect.Slice {
			targetType = targetType.Elem()
		}
		if targetType.Kind() == reflect.Ptr {
			targetType = targetType.Elem()
		}

		if targetType.Kind() == reflect.Struct {
			if targetType.PkgPath() == "time" {
				continue
			}
			if strings.Contains(strings.ToLower(targetType.PkgPath()), "uuid") {
				continue
			}

			gormTag := field.Tag.Get("gorm")

			if gormTag == "-" {
				continue
			}

			if strings.Contains(strings.ToLower(gormTag), "embedded") {
				continue
			}

			db = db.Preload(field.Name)
		}
	}

	return db
}

func setPaginationHeaders(c echo.Context, offset, limit int, total int64) {
	c.Response().Header().Set("X-Total-Count", strconv.FormatInt(total, 10))

	end := offset + limit
	if end > int(total) {
		end = int(total)
	}
	if end < offset {
		end = offset
	}

	contentRange := fmt.Sprintf("resources %d-%d/%d", offset, end, total)
	c.Response().Header().Set("Content-Range", contentRange)
	c.Response().Header().Set("Access-Control-Expose-Headers", "Content-Range, X-Total-Count")
}

func handleDBError(c echo.Context, err error) error {
	if strings.Contains(strings.ToLower(err.Error()), "unique") ||
		strings.Contains(strings.ToLower(err.Error()), "duplicate") {
		return c.JSON(http.StatusConflict, echo.Map{"error": "Unique constraint violation"})
	}
	if strings.Contains(strings.ToLower(err.Error()), "foreign key") {
		return c.JSON(http.StatusBadRequest, echo.Map{"error": "Invalid relation ID"})
	}
	return c.JSON(http.StatusInternalServerError, echo.Map{"error": err.Error()})
}

func applyGlobalSearch[T any](query *gorm.DB, q string) *gorm.DB {
	var sample T
	t := reflect.TypeOf(sample)

	if t.Kind() == reflect.Ptr {
		t = t.Elem()
	}

	var conditions []string
	var values []interface{}

	for i := 0; i < t.NumField(); i++ {
		field := t.Field(i)
		isString := field.Type.Kind() == reflect.String

		if isString {
			colName := getColumnName(field)
			if colName == "id" || colName == "-" {
				continue
			}
			conditions = append(conditions, fmt.Sprintf("%s ILIKE ?", colName))
			values = append(values, "%"+q+"%")
		}
	}

	if len(conditions) > 0 {
		return query.Where(strings.Join(conditions, " OR "), values...)
	}
	return query
}

func getColumnName(field reflect.StructField) string {
	gormTag := field.Tag.Get("gorm")
	if gormTag != "" {
		parts := strings.Split(gormTag, ";")
		for _, part := range parts {
			if strings.HasPrefix(part, "column:") {
				return strings.TrimPrefix(part, "column:")
			}
		}
	}
	jsonTag := field.Tag.Get("json")
	if jsonTag != "" && jsonTag != "-" {
		return strings.Split(jsonTag, ",")[0]
	}
	return toSnakeCase(field.Name)
}

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

func toSnakeCase(str string) string {
	var matchFirstCap = regexp.MustCompile("(.)([A-Z][a-z]+)")
	var matchAllCap = regexp.MustCompile("([a-z0-9])([A-Z])")
	snake := matchFirstCap.ReplaceAllString(str, "${1}_${2}")
	snake = matchAllCap.ReplaceAllString(snake, "${1}_${2}")
	return strings.ToLower(snake)
}
