package models

import "time"

type Person struct {
	BaseModel
	LastName   string     `gorm:"not null;size:50" json:"last_name"`
	FirstName  string     `gorm:"not null;size:50" json:"first_name"`
	MiddleName string     `gorm:"size:50" json:"middle_name"`
	BirthDate  *time.Time `json:"birth_date,omitempty"`
	Phone      string     `gorm:"size:20" json:"phone"`
	Email      string     `gorm:"size:100;unique" json:"email"`
}
