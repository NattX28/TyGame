package models

import (
	"github.com/google/uuid"
)

type Room struct {
	RoomID 		uuid.UUID 	`gorm:"primaryKey"`
	IsGroup 	bool

	RoomMembers []RoomMember `gorm:"foreignKey:RoomID;onDelete:CASCADE"`
}

type RoomMember struct {
	RoomID               uuid.UUID 	`gorm:"primaryKey;index"`
	UserID               uuid.UUID 		`gorm:"primaryKey;index"`
	Verify               bool   		`gorm:"default:false"`
	Block                bool   		`gorm:"default:false"`
	LastSeenMessageID    *uint  		`gorm:"index"`
}

type ReqCreateRoom struct {
	UserIDs  		[]uuid.UUID 		`json:"user_ids"`
}
