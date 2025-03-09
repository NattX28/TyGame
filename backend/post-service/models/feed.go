package models

import (
	"github.com/google/uuid"
)

type FeedPost struct {
	ID        			uuid.UUID 			`json:"uuid"`
	CommunityID 		uuid.UUID      	`json:"community_id" 	gorm:"type:uuid;not null"`
	UserID      		uuid.UUID      	`json:"user_id" 			gorm:"type:uuid;not null"`
	Content     		string    			`json:"content" 			gorm:"null"`
	Visibility  		string    			`json:"visibility"`
	Image       		string    			`json:"image"`
	Score       		float64   			`json:"score"`
  Liked    				bool        		`json:"liked"`
  LikesCount    	int        			`json:"likes"`
  CommentsCount 	int        			`json:"comments"`
	Timestamp   		int64     			`json:"timestamp"`
}