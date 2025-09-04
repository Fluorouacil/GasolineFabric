package models

import "time"

type VerificationHistory struct {
	BaseModel
	EquipmentID          uint      `gorm:"not null" json:"equipment_id"`
	Equipment            Equipment `gorm:"foreignKey:EquipmentID" json:"equipment"`
	VerificationDate     time.Time `gorm:"not null" json:"verification_date"`
	Result               string    `gorm:"not null;check:result IN ('passed', 'failed')" json:"result"`
	CertificateNumber    string    `gorm:"size:50;unique" json:"certificate_number"`
	VerifiedByEmployeeID uint      `gorm:"not null" json:"verified_by_employee_id"`
	VerifiedByEmployee   Employee  `gorm:"foreignKey:VerifiedByEmployeeID" json:"verified_by_employee"`
	NextVerificationDate time.Time `gorm:"not null" json:"next_verification_date"`
	Notes                string    `json:"notes"`
}
