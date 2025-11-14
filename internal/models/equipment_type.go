package models

type EquipmentType struct {
	BaseModel
	Name                       string      `gorm:"not null;size:100;unique" json:"name"`
	VerificationIntervalMonths int         `gorm:"not null;check:verification_interval_months > 0" json:"verification_interval_months"`
	Description                string      `json:"description"`
	Equipment                  []Equipment `gorm:"foreignKey:EquipmentTypeUUID" json:"equipment"`
}
