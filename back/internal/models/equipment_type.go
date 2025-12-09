package models

import "github.com/lib/pq"

type EquipmentType struct {
	BaseModel
	Name                       string         `gorm:"not null;size:100;unique" json:"name"`
	VerificationIntervalMonths int            `gorm:"not null;check:verification_interval_months > 0" json:"verification_interval_months"`
	Description                string         `json:"description"`
	MeasurableUnits            pq.StringArray `gorm:"type:text[]" json:"measurable_units"`
}
