package models

import (
	"time"
	"github.com/google/uuid"
)

type Comment struct {
	ID        	uuid.UUID 	`gorm:"type:uuid;default:gen_random_uuid();primaryKey"`
  PostID    	uuid.UUID 	`gorm:"type:uuid;not null"`
  UserID    	uuid.UUID 	`gorm:"type:uuid;not null"`
	Content   	string    	`gorm:"not null"`
	CreatedAt 	time.Time 	`gorm:"default:current_timestamp"`
		
	Post      	Post      	`gorm:"foreignKey:PostID;onDelete:CASCADE"`
	Likes     	[]Like    	`gorm:"foreignKey:CommentID;onDelete:CASCADE"`
}

type CommentFormReq struct {
	Content   	string    	`json:"content" gorm:"not null"`
}

type CommentFormRes struct {
	ID       		uuid.UUID		`json:"id"`
	UserID   		uuid.UUID		`json:"user_id"`
	Content  		string   		`json:"content"`
	CreatedAt 	int64     	`json:"timestamp"`
	LikeCount		int      		`json:"like_count" gorm:"not null;default:0"`
}