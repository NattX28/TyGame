package models

import "github.com/google/uuid"

type Party struct {
	ID      uint          `gorm:"primaryKey;autoIncrement"`
	maxSlots int `gorm:"not null"`
	Members []PartyMember `gorm:"foreignKey:PartyID"`
}

type PartyMember struct {
	// composite key
	PartyID uint `gorm:"primaryKey"`
	UserID  uuid.UUID `gorm:"primaryKey"`
}
