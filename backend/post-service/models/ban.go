package models

import (
	"time"
	"github.com/google/uuid"
)

type BanUser struct {
	ID        	uuid.UUID 	`gorm:"type:uuid;default:gen_random_uuid();primaryKey"`
  UserID    	uuid.UUID 	`gorm:"type:uuid;not null"`
  Timeout    	time.Time 	`gorm:"not null"`
	CreatedAt 	time.Time 	`gorm:"default:current_timestamp"`
}
