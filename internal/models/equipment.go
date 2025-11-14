package models

import (
	"time"

	"github.com/google/uuid"
)

type Equipment struct {
	BaseModel
	SerialNumber      string        `gorm:"not null;size:50;uniqueIndex" json:"serial_number"`
	EquipmentTypeUUID uuid.UUID     `gorm:"not null" json:"equipment_type_uuid"`
	EquipmentType     EquipmentType `gorm:"foreignKey:EquipmentTypeUUID" json:"equipment_type"`
	PurchaseDate      time.Time     `gorm:"not null" json:"purchase_date"`
	Cost              float64       `gorm:"not null;check:cost > 0" json:"cost"`
	LifespanYears     int           `gorm:"not null;check:lifespan_years > 0" json:"lifespan_years"`
}
