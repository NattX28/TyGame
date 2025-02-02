package models

import (
	"time"
)

type Like struct {
	ID        uint      `json:"id" gorm:"primaryKey;autoIncrement"`
	UserID    uint      `json:"user_id" gorm:"not null;uniqueIndex:idx_like_post_user;uniqueIndex:idx_like_comment_user"`
	PostID    uint     `json:"post_id,omitempty" gorm:"default:null;uniqueIndex:idx_like_post_user"`
	CommentID uint     `json:"comment_id,omitempty" gorm:"default:null;uniqueIndex:idx_like_comment_user"`
	CreatedAt time.Time `json:"created_at" gorm:"default:current_timestamp"`

	Post    *Post    `json:"post,omitempty" gorm:"foreignKey:PostID;onDelete:CASCADE"`
	Comment *Comment `json:"comment,omitempty" gorm:"foreignKey:CommentID;onDelete:CASCADE"`
}