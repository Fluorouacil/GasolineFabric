package models

import (
	"time"

	"github.com/google/uuid"
)

type VerificationHistory struct {
	BaseModel
	EquipmentUUID          uuid.UUID `gorm:"not null" json:"equipment_uuid"`
	Equipment              Equipment `gorm:"foreignKey:EquipmentUUID" json:"equipment"`
	VerificationDate       time.Time `gorm:"not null" json:"verification_date"`
	Result                 string    `gorm:"not null;check:result IN ('passed', 'failed')" json:"result"`
	CertificateNumber      string    `gorm:"size:50;unique" json:"certificate_number"`
	VerifiedByEmployeeUUID uuid.UUID `gorm:"not null" json:"verified_by_employee_uuid"`
	VerifiedByEmployee     Employee  `gorm:"foreignKey:VerifiedByEmployeeUUID" json:"verified_by_employee"`
	NextVerificationDate   time.Time `gorm:"not null" json:"next_verification_date"`
	Notes                  string    `json:"notes"`
}
