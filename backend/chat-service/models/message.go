package models

import (
	"gorm.io/gorm"
	"github.com/google/uuid"
)

type Message struct {
    ID          uuid.UUID  `json:"id" gorm:"type:uuid;primaryKey"`
    RoomID      uuid.UUID  `json:"room_id" gorm:"index:idx_room_timestamp,priority:1"`
    SenderID    uuid.UUID  `json:"sender_id"`
    Content     string     `json:"content" gorm:"type:text;charset=utf8mb4"`
    Timestamp   int64      `json:"timestamp" gorm:"index:idx_room_timestamp,priority:2"`
}

type WsForm struct {
    Event       string             `json:"Event"`
    RoomID      string             `json:"room_id"`
    Messages    []Message          `json:"messages"`
}

func (u *Message) BeforeCreate(tx *gorm.DB) error {
	if u.ID == uuid.Nil {
		u.ID = uuid.New()
	}
	return nil
}