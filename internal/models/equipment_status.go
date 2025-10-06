package models

import "time"

type EquipmentStatus struct {
	BaseModel
	EquipmentID           uint       `gorm:"not null;uniqueIndex" json:"equipment_id"` // 1:1 связь
	Equipment             Equipment  `gorm:"foreignKey:EquipmentID;constraint:OnDelete:CASCADE" json:"equipment"`
	Status                string     `gorm:"not null;default:in_use;check:status IN ('in_use', 'on_verification', 'in_repair', 'decommissioned')" json:"status"`
	Location              string     `gorm:"not null;size:100" json:"location"`
	ResponsibleEmployeeID uint       `gorm:"not null" json:"responsible_employee_id"`
	ResponsibleEmployee   Employee   `gorm:"foreignKey:ResponsibleEmployeeID" json:"responsible_employee"`
	NextVerificationDate  time.Time  `gorm:"not null;index" json:"next_verification_date"`
}