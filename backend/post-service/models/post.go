package models

import (
	"time"
	"github.com/google/uuid"
)

type Post struct {
	ID        		uuid.UUID 		`gorm:"type:uuid;default:gen_random_uuid();primaryKey"`
	CommunityID 	uuid.UUID     `gorm:"type:uuid;not null"`
	UserID      	uuid.UUID     `gorm:"type:uuid;not null"`
	Content     	string    		`gorm:"type:text;null"`
	Visibility  	string    		`gorm:"type:varchar(20);default:'public';check:visibility IN ('public', 'private', 'friends')"`
	Image 				string 				`json:"image,omitempty" gorm:"type:text;null"`
	Timestamp   	int64     		`json:"timestamp"`
	CreatedAt   	time.Time 		`gorm:"autoCreateTime"`

	Comments    	[]Comment 		`gorm:"foreignKey:PostID;onDelete:CASCADE"`
	Likes       	[]Like    		`gorm:"foreignKey:PostID;onDelete:CASCADE"`
}

type EditPostRequest struct {
	Content       	string      `json:"content" 			gorm:"not null"`
	Visibility    	string     	`json:"visibility,omitempty"`
}
