package models

import (
	"time"
	"gorm.io/gorm"
)

type Like struct {
	ID          uint       `json:"id" gorm:"primaryKey"`
	UserID      uint       `json:"user_id" binding:"required"`
	PostID      *uint      `json:"post_id,omitempty"`
	CommentID   *uint      `json:"comment_id,omitempty"`
	CreatedAt   time.Time		`json:"created_at" gorm:"autoCreateTime"`
	UpdatedAt 	time.Time 	`json:"updated_at" gorm:"autoUpdateTime"`
}