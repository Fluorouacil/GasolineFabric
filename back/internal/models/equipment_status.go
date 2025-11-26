package models

import (
	"time"

	"github.com/google/uuid"
)

type EquipmentStatus struct {
	BaseModel
	EquipmentUUID        uuid.UUID `gorm:"not null;uniqueIndex" json:"equipment_uuid"`
	Equipment            Equipment `gorm:"foreignKey:EquipmentUUID;constraint:OnDelete:CASCADE" json:"equipment"`
	Status               string    `gorm:"not null;default:in_use;check:status IN ('in_use', 'on_verification', 'in_repair', 'decommissioned')" json:"status"`
	Location             string    `gorm:"not null;size:100" json:"location"`
	NextVerificationDate time.Time `gorm:"not null;index" json:"next_verification_date"`
}
