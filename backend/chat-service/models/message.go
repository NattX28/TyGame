package models

import (
	"github.com/google/uuid"
)

type Message struct {
    ID        uint       `json:"id" gorm:"primaryKey"`
    RoomID    uuid.UUID  `json:"room_id" gorm:"index:idx_room_timestamp,priority:1"`
    SenderID  uuid.UUID  `json:"sender_id"`
    Content   string     `json:"content" gorm:"type:text;charset=utf8mb4"`
    Timestamp int64      `json:"timestamp" gorm:"index:idx_room_timestamp,priority:2"`
}