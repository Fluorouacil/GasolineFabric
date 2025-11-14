package utils

import (
	"encoding/json"
	"errors"
	"net/http"
	"strings"

	"github.com/google/uuid"
	"github.com/labstack/echo/v4"
	"gorm.io/gorm"
)

// GenericPostHandler создаёт новую запись типа T
func GenericPostHandler[T any](db *gorm.DB) echo.HandlerFunc {
	return func(c echo.Context) error {
		var item T

		if err := c.Bind(&item); err != nil {
			return c.JSON(http.StatusBadRequest, map[string]string{"error": "Invalid JSON"})
		}

		if err := SafeCreate(db, &item); err != nil {
			if strings.Contains(strings.ToLower(err.Error()), "unique") ||
				strings.Contains(strings.ToLower(err.Error()), "duplicate") {
				return c.JSON(http.StatusConflict, map[string]string{"error": "Unique constraint violation"})
			}
			return c.JSON(http.StatusInternalServerError, map[string]string{"error": "Failed to create record"})
		}

		return c.JSON(http.StatusCreated, item)
	}
}

// GenericGetHandler получает запись типа T по UUID из параметра :uuid
func GenericGetHandler[T any](db *gorm.DB) echo.HandlerFunc {
	return func(c echo.Context) error {
		uuidParam := c.Param("uuid")
		if _, err := uuid.Parse(uuidParam); err != nil {
			return c.JSON(http.StatusBadRequest, map[string]string{"error": "Invalid UUID format"})
		}

		item, err := FindByUUID[T](db, uuidParam)
		if err != nil {
			if err == gorm.ErrRecordNotFound {
				return c.JSON(http.StatusNotFound, map[string]string{"error": "Record not found"})
			}
			return c.JSON(http.StatusInternalServerError, map[string]string{"error": "Database error"})
		}

		return c.JSON(http.StatusOK, item)
	}
}

// GenericGetHandler получает запись типа T по UUID из параметра :uuid и делает конкретные изменения в записи
func GenericPatchHandler[T any](db *gorm.DB) echo.HandlerFunc {
	return func(c echo.Context) error {
		uuidParam := c.Param("uuid")
		if _, err := uuid.Parse(uuidParam); err != nil {
			return c.JSON(http.StatusBadRequest, map[string]string{"error": "Invalid UUID format"})
		}

		// Читаем raw JSON как map[string]interface{}
		var updates map[string]interface{}
		if err := json.NewDecoder(c.Request().Body).Decode(&updates); err != nil {
			return c.JSON(http.StatusBadRequest, map[string]string{"error": "Invalid JSON"})
		}

		if err := SafeUpdate[T](db, uuidParam, updates); err != nil {
			if err == gorm.ErrRecordNotFound {
				return c.JSON(http.StatusNotFound, map[string]string{"error": "Record not found"})
			}
			if strings.Contains(strings.ToLower(err.Error()), "unique") {
				return c.JSON(http.StatusConflict, map[string]string{"error": "Unique constraint violation"})
			}
			return c.JSON(http.StatusInternalServerError, map[string]string{"error": "Update failed"})
		}

		updated, err := FindByUUID[T](db, uuidParam)
		if err != nil {
			return c.JSON(http.StatusInternalServerError, map[string]string{"error": "Failed to fetch updated record"})
		}

		return c.JSON(http.StatusOK, updated)
	}
}

// GenericGetHandlerWithPreload создаёт обработчик с указанием preload
func GenericGetHandlerWithPreload[T any](db *gorm.DB, preload ...string) echo.HandlerFunc {
	return func(c echo.Context) error {
		uuidParam := c.Param("uuid")
		if _, err := uuid.Parse(uuidParam); err != nil {
			return c.JSON(http.StatusBadRequest, echo.Map{"error": "Invalid UUID"})
		}

		item, err := FindByUUIDWithPreload[T](db, uuidParam, preload...)
		if err != nil {
			if errors.Is(err, gorm.ErrRecordNotFound) {
				return c.JSON(http.StatusNotFound, echo.Map{"error": "Not found"})
			}
			return c.JSON(http.StatusInternalServerError, echo.Map{"error": "DB error"})
		}

		return c.JSON(http.StatusOK, item)
	}
}

// GenericPostHandlerWithPreload создаёт запись и возвращает её с предзагруженными связями
func GenericPostHandlerWithPreload[T any](db *gorm.DB, preload ...string) echo.HandlerFunc {
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

		uuidVal, err := extractUUID(item)
		if err != nil {
			return c.JSON(http.StatusInternalServerError, echo.Map{"error": "Failed to extract UUID"})
		}

		loadedItem, err := FindByUUIDWithPreload[T](db, uuidVal.String(), preload...)
		if err != nil {
			return c.JSON(http.StatusInternalServerError, echo.Map{"error": "Failed to load created record with relations"})
		}

		return c.JSON(http.StatusCreated, loadedItem)
	}
}
