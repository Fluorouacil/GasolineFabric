package models

import "time"

type Employee struct {
	BaseModel
	PersonID     uint       `gorm:"not null" json:"person_id"`
	Person       Person     `gorm:"foreignKey:PersonID" json:"person"`
	DepartmentID uint       `gorm:"not null" json:"department_id"`
	Department   Department `gorm:"foreignKey:DepartmentID" json:"department"`
	Position     string     `gorm:"not null;size:100" json:"position"`
	HireDate     time.Time  `json:"hire_date"`
	Status       string     `gorm:"not null;default:active;check:status IN ('active', 'on_leave', 'dismissed')" json:"status"`
}
