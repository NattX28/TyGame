package models

import (
	"github.com/google/uuid"
)

type Message struct {
	ID       		uint  	 		`gorm:"primaryKey"`
	RoomID   		uuid.UUID	 		`gorm:"index"`
	SenderID   		uuid.UUID
	Content  		string    		`gorm:"type:text;charset=utf8mb4"`
	Timestamp		int64 	 		`gorm:"autoCreateTime"`
}