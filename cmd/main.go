package main

import (
	"GasolineFabric/internal/models"
	"fmt"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

func main() {
	db, err := gorm.Open(postgres.Open("host=localhost user=GasolineAdmin password=admin dbname=GasolineFabric TimeZone=Europe/Samara"))
	if err != nil {
		fmt.Println(err)
	}

	db.AutoMigrate(&models.BaseModel{}, &models.Person{}, &models.Employee{}, &models.Equipment{}, &models.Department{}, &models.EquipmentType{}, &models.VerificationHistory{}, &models.EquipmentStatus{})
}