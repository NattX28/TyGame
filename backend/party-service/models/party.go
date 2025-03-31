package models

import (
	"time"

	"github.com/google/uuid"
)

type PartyStatus string

const (
    PartyStatusOpen    PartyStatus = "OPEN"
    PartyStatusFull    PartyStatus = "FULL"
    PartyStatusClosed  PartyStatus = "CLOSED"
)

type Party struct {
    ID        uint          `gorm:"primaryKey;autoIncrement"`
    Status    PartyStatus   `gorm:"not null;default:'OPEN'"`
    MaxSlots  int           `gorm:"not null"`
    CommunityID  uuid.UUID     `gorm:"not null"`
    CreatedAt time.Time     `gorm:"not null"`
    Members   []PartyMember `gorm:"foreignKey:PartyID"`
}

type PartyMember struct {
    PartyID   uint      `gorm:"primaryKey"`
    UserID    uuid.UUID `gorm:"primaryKey"`
    JoinedAt  time.Time `gorm:"not null"`
}
