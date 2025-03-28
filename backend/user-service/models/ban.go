package models

import (
	"time"
	"github.com/google/uuid"
)

type Ban struct {
  UserID    	uuid.UUID 	`gorm:"type:uuid;not null;primaryKey"`
	Reason			string 			`gorm:"not null"`
  Timestamp   int64 		 	`gorm:"not null"`
	CreatedAt 	time.Time 	`gorm:"default:current_timestamp"`
}

type BanUserRequest struct {
	UserID 			string 				`json:"userid"`
	Reason			string 				`json:"reason"`
	Timestamp 	int64 				`json:"timestamp"`
}

type UnbanUserRequest struct {
	UserID 			string 				`json:"userid"`
}
