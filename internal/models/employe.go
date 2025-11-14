package models

import (
	"time"

	"github.com/google/uuid"
)

type Employee struct {
	BaseModel
	PersonUUID     uuid.UUID  `gorm:"not null" json:"person_uuid"`
	Person         Person     `gorm:"foreignKey:PersonUUID" json:"person"`
	DepartmentUUID uuid.UUID  `gorm:"not null" json:"department_uuid"`
	Department     Department `gorm:"foreignKey:DepartmentUUID" json:"department"`
	Position       string     `gorm:"not null;size:100" json:"position"`
	HireDate       time.Time  `json:"hire_date"`
	Status         string     `gorm:"not null;default:active;check:status IN ('active', 'on_leave', 'dismissed')" json:"status"`
}
