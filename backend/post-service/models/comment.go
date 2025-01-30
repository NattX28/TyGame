package models

import (
	"time"
	"gorm.io/gorm"
)

type Comment struct {
	ID          uint       `json:"id" gorm:"primaryKey"`
	UserID      uint       `json:"user_id" binding:"required"`
	PostID      uint       `json:"post_id" binding:"required"`
	Content     string    `json:"content" binding:"required"`
	CreatedAt   time.Time		`json:"created_at" gorm:"autoCreateTime"`
	UpdatedAt 	time.Time 	`json:"updated_at" gorm:"autoUpdateTime"`
}