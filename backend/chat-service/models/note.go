package models

import (
	"time"
	"github.com/google/uuid"
)

type Note struct {
	UserID    uuid.UUID `gorm:"type:uuid;primaryKey"`
	Content   string
	CreatedAt time.Time `gorm:"default:current_timestamp"`
}
