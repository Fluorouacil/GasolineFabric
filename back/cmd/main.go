package main

import (
	"GasolineFabric/internal/utils"

	"GasolineFabric/internal/api"

	"GasolineFabric/internal/reports"

	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
)

func main() {
	db := utils.InitDB()

	e := echo.New()

	api.SetupRoutes(e, db)
	reportService := reports.NewReportService(db)
	reportHandler := reports.NewReportHandler(*reportService)
	reportHandler.RegisterRoutes(e)

	e.Use(middleware.CORS())

	e.Start(":8080")
}
