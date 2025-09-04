package models

type Department struct {
	BaseModel
	Name   string `gorm:"not null;size:100;unique" json:"name"`
	Code   string `gorm:"size:20;unique" json:"code"`
	Adress string `gorm:"size:150" json:"adress"`
}
