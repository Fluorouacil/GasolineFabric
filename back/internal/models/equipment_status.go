package models

import (
	"github.com/google/uuid"
)

type EquipmentStatus struct {
	BaseModel
	EquipmentUUID  uuid.UUID  `gorm:"not null;uniqueIndex" json:"equipment_uuid"`
	Equipment      Equipment  `gorm:"foreignKey:EquipmentUUID;constraint:OnDelete:CASCADE" json:"equipment"`
	Status         string     `gorm:"not null;default:in_use;check:status IN ('in_use', 'on_verification', 'in_repair', 'decommissioned')" json:"status"`
	DepartmentUUID uuid.UUID  `gorm:"not null" json:"department_uuid"`
	Department     Department `gorm:"foreignKey:DepartmentUUID" json:"department"`
}
