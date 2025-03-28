package models

import (
	"time"
	"github.com/google/uuid"
)

type BanUser struct {
	ID        	uuid.UUID 	`gorm:"type:uuid;default:gen_random_uuid();primaryKey"`
  UserID    	uuid.UUID 	`gorm:"type:uuid;not null"`
  Timestamp   int64 		 	`gorm:"not null"`
	CreatedAt 	time.Time 	`gorm:"default:current_timestamp"`
}

type BanUserRequest struct {
	UserID 			string 				`json:"userid"`,
	Timestamp 	int64 				`json:"timestamp"`
}

type BanUsers struct {
	UserID 			string 				`json:"userid"`,
	Timestamp 	int64 				`json:"timestamp"`
}