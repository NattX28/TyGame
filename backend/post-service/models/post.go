package models

import (
	"time"
)

type Post struct {
	ID          uint      `gorm:"primaryKey;autoIncrement;index"`
	CommunityID uint      `gorm:"not null"`
	UserID      uint      `gorm:"not null"`
	Content     string    `gorm:"not null"`
	Visibility  string    `gorm:"type:varchar(20);default:'public';check:visibility IN ('public', 'private', 'friends')"`
	Image       string    `gorm:"type:text;"`
	CreatedAt   time.Time `gorm:"default:current_timestamp"`

	Comments    []Comment `gorm:"foreignKey:PostID;onDelete:CASCADE"`
	Likes       []Like    `gorm:"foreignKey:PostID;onDelete:CASCADE"`
}

type EditPostRequest struct {
	Content       string      `json:"content" binding:"required"`
	Visibility    string     `json:"visibility,omitempty"`
}