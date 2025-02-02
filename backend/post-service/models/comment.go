package models

import (
	"time"
)

type Comment struct {
	ID        uint      `gorm:"primaryKey;autoIncrement;index"`
	PostID    uint      `gorm:"not null"`
	UserID    uint      `gorm:"not null"`
	Content   string    `gorm:"not null"`
	CreatedAt time.Time `gorm:"default:current_timestamp"`
	
	Post      Post      `gorm:"foreignKey:PostID;onDelete:CASCADE"`
	Likes     []Like    `gorm:"foreignKey:CommentID;onDelete:CASCADE"`
}