package models

import "time"

type Equipment struct {
	BaseModel
	SerialNumber    string        `gorm:"not null;size:50;uniqueIndex" json:"serial_number"`
	EquipmentTypeID uint          `gorm:"not null" json:"equipment_type_id"`
	EquipmentType   EquipmentType `gorm:"foreignKey:EquipmentTypeID" json:"equipment_type"`
	PurchaseDate    time.Time     `gorm:"not null" json:"purchase_date"`
	Cost            float64       `gorm:"not null;check:cost > 0" json:"cost"`
	LifespanYears   int           `gorm:"not null;check:lifespan_years > 0" json:"lifespan_years"`
}
