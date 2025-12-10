package api

import (
	"GasolineFabric/internal/models"
	"GasolineFabric/internal/utils"

	"github.com/labstack/echo/v4"
	"gorm.io/gorm"
)

func SetupRoutes(e *echo.Echo, db *gorm.DB) {
	// Departments
	e.GET("/departments", utils.GenericListHandler[models.Department](db))
	e.POST("/departments", utils.GenericPostHandler[models.Department](db))
	e.GET("/departments/:id", utils.GenericGetHandler[models.Department](db))
	e.PUT("/departments/:id", utils.GenericPatchHandler[models.Department](db))
	e.DELETE("/departments/:id", utils.GenericDeleteHandler[models.Department](db))

	// Persons
	e.GET("/persons", utils.GenericListHandler[models.Person](db))
	e.POST("/persons", utils.GenericPostHandler[models.Person](db))
	e.GET("/persons/:id", utils.GenericGetHandler[models.Person](db))
	e.PUT("/persons/:id", utils.GenericPatchHandler[models.Person](db))
	e.DELETE("/persons/:id", utils.GenericDeleteHandler[models.Person](db))

	// Employees
	e.GET("/employees", utils.GenericListHandler[models.Employee](db))
	e.POST("/employees", utils.GenericPostHandler[models.Employee](db))
	e.GET("/employees/:id", utils.GenericGetHandler[models.Employee](db))
	e.PUT("/employees/:id", utils.GenericPatchHandler[models.Employee](db))
	e.DELETE("/employees/:id", utils.GenericDeleteHandler[models.Employee](db))

	// EquipmentTypes
	e.GET("/equipment-types", utils.GenericListHandler[models.EquipmentType](db))
	e.POST("/equipment-types", utils.GenericPostHandler[models.EquipmentType](db))
	e.GET("/equipment-types/:id", utils.GenericGetHandler[models.EquipmentType](db))
	e.PUT("/equipment-types/:id", utils.GenericPatchHandler[models.EquipmentType](db))
	e.DELETE("/equipment-types/:id", utils.GenericDeleteHandler[models.EquipmentType](db))

	// Equipment
	e.GET("/equipment", utils.GenericListHandler[models.Equipment](db))
	e.POST("/equipment", utils.GenericPostHandler[models.Equipment](db))
	e.GET("/equipment/:id", utils.GenericGetHandler[models.Equipment](db))
	e.PUT("/equipment/:id", utils.GenericPatchHandler[models.Equipment](db))
	e.DELETE("/equipment/:id", utils.GenericDeleteHandler[models.Equipment](db))

	// EquipmentStatuses
	e.GET("/equipment-statuses", utils.GenericListHandler[models.EquipmentStatus](db))
	e.POST("/equipment-statuses", utils.GenericPostHandler[models.EquipmentStatus](db))
	e.GET("/equipment-statuses/:id", utils.GenericGetHandler[models.EquipmentStatus](db))
	e.PUT("/equipment-statuses/:id", utils.GenericPatchHandler[models.EquipmentStatus](db))
	e.DELETE("/equipment-statuses/:id", utils.GenericDeleteHandler[models.EquipmentStatus](db))

	// VerificationHistories
	e.GET("/verification-histories", utils.GenericListHandler[models.VerificationHistory](db))
	e.POST("/verification-histories", utils.GenericPostHandler[models.VerificationHistory](db))
	e.GET("/verification-histories/:id", utils.GenericGetHandler[models.VerificationHistory](db))
	e.PUT("/verification-histories/:id", utils.GenericPatchHandler[models.VerificationHistory](db))
	e.DELETE("/verification-histories/:id", utils.GenericDeleteHandler[models.VerificationHistory](db))
}
