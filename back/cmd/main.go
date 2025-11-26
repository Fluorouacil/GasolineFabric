package main

import (
	"GasolineFabric/internal/utils"

	"GasolineFabric/internal/api"

	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
)

func main() {
	db := utils.InitDB()

	e := echo.New()

	api.SetupRoutes(e, db)

	e.Use(middleware.CORS())

	e.Start(":8080")
}
