package main

import (
	"GasolineFabric/internal/models"
	"GasolineFabric/internal/utils"

	"github.com/labstack/echo/v4"
)

func main() {
	db := utils.InitDB() // твоя функция инициализации GORM

	e := echo.New()

	// Equipment
	e.POST("/equipment", utils.GenericPostHandler[models.Equipment](db))
	e.GET("/equipment/:uuid", utils.GenericGetHandler[models.Equipment](db))

	// EquipmentType
	e.POST("/equipment-types", utils.GenericPostHandler[models.EquipmentType](db))
	e.GET("/equipment-types/:uuid", utils.GenericGetHandler[models.EquipmentType](db))

	// EquipmentStatus
	e.POST("/equipment-statuses", utils.GenericPostHandlerWithPreload[models.EquipmentStatus](
		db,
		"Equipment",
		"Equipment.EquipmentType",
	))
	e.GET("/equipment-statuses/:uuid", utils.GenericGetHandlerWithPreload[models.EquipmentStatus](
		db,
		"Equipment",
		"Equipment.EquipmentType",
	))

	e.Start(":8080")
}
