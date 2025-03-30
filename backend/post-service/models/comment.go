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
	Timestamp   int64
	CreatedAt   time.Time 	`gorm:"autoCreateTime"`
		
	Post      	Post      	`gorm:"foreignKey:PostID;constraint:onDelete:CASCADE"`
	Likes     	[]Like    	`gorm:"foreignKey:CommentID;constraint:onDelete:CASCADE"`
}

type CommentFormReq struct {
	Content   	string    	`json:"content" gorm:"not null"`
}

type CommentFormRes struct {
	ID       		uuid.UUID		`json:"ID"`
	PostID	 		uuid.UUID		`json:"PostID"`
	UserID   		uuid.UUID		`json:"UserID"`
	Content  		string			`json:"Content"`
	Timestamp   int64     	`json:"Timestamp"`
	LikeCount		int					`json:"LikeCount"`
	Liked				bool				`json:"Liked"`
}