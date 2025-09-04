package models

import "time"

type Equipment struct {
	BaseModel
	SerialNumber          string                `gorm:"not null;size:50;uniqueIndex" json:"serial_number"`
	EquipmentTypeID       uint                  `gorm:"not null" json:"equipment_type_id"`
	EquipmentType         EquipmentType         `gorm:"foreignKey:EquipmentTypeID" json:"equipment_type"`
	PurchaseDate          time.Time             `gorm:"not null" json:"purchase_date"`
	Cost                  float64               `gorm:"not null;check:cost > 0" json:"cost"`
	LifespanYears         int                   `gorm:"not null;check:lifespan_years > 0" json:"lifespan_years"`
	Status                string                `gorm:"not null;default:in_use;check:status IN ('in_use', 'on_verification', 'in_repair', 'decommissioned')" json:"status"`
	Location              string                `gorm:"not null;size:100" json:"location"`
	ResponsibleEmployeeID uint                  `gorm:"not null" json:"responsible_employee_id"`
	ResponsibleEmployee   Employee              `gorm:"foreignKey:ResponsibleEmployeeID" json:"responsible_employee"`
	LastVerificationDate  *time.Time            `json:"last_verification_date,omitempty"`
	NextVerificationDate  time.Time             `gorm:"not null;index" json:"next_verification_date"` // Индекс для макроса
	VerificationHistory   []VerificationHistory `gorm:"foreignKey:EquipmentID" json:"verification_history"`
}
