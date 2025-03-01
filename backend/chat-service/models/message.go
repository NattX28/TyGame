package models

import (
	"github.com/google/uuid"
)

type Message struct {
	ID       	uint      	`gorm:"primaryKey"`
	RoomID   	uuid.UUID 	`gorm:"index:idx_room_timestamp,priority:1"`  // Composite index part 1
	SenderID   	uuid.UUID
	Content  	string    	`gorm:"type:text;charset=utf8mb4"`
	Timestamp	int64      	`gorm:"index:idx_room_timestamp,priority:2"`  // Composite index part 2
}