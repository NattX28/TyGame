package models

import (
	"time"
	"gorm.io/gorm"
	"github.com/google/uuid"
)

type Like struct {
	ID 						uuid.UUID 		`json:"id" 										gorm:"type:uuid;primaryKey"`
	UserID     		uuid.UUID  		`json:"user_id" 							gorm:"type:uuid;not null;index"`
	PostID     		*uuid.UUID 		`json:"post_id,omitempty" 		gorm:"index:idx_like_post_user"`
	CommentID  		*uuid.UUID 		`json:"comment_id,omitempty" 	gorm:"index:idx_like_comment_user"`
	CreatedAt  		time.Time  		`json:"created_at" 						gorm:"autoCreateTime"`
	
	Post    	 		*Post    			`json:"post,omitempty" 				gorm:"foreignKey:PostID;onDelete:CASCADE"`
	Comment 	 		*Comment 			`json:"comment,omitempty" 		gorm:"foreignKey:CommentID;onDelete:CASCADE"`
}

func (u *Like) BeforeCreate(tx *gorm.DB) error {
	if u.ID == uuid.Nil {
		u.ID = uuid.New()
	}
	return nil
}
