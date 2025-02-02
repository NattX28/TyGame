package models

import (
	"time"
	"gorm.io/gorm"
)

type Post struct {
	ID            uint        `json:"id" gorm:"primaryKey"`
	UserID        uint        `json:"user_id" binding:"required"`
	CommunityID   uint        `json:"community_id" binding:"required"`
	Content       string      `json:"content" binding:"required"`
	Visibility    *string     `json:"visibility,omitempty"`
	CreatedAt     time.Time		`json:"created_at"`
	UpdatedAt 	  time.Time 	`json:"updated_at"`
}

type CreatePostRequest struct {
	CommunityID uint    `json:"community_id" binding:"required"`
	Content     string  `json:"content" binding:"required"`
	Visibility  *string `json:"visibility,omitempty"`
}

type EditPostRequest struct {
	Content       string      `json:"content" binding:"required"`
	Visibility    *string     `json:"visibility,omitempty"`
}