package models

import (
	"time"
	"github.com/google/uuid"
)

type FeedPost struct {
	CommunityID 		uuid.UUID      	`json:"community_id" 	gorm:"type:uuid;not null"`
	UserID      		uuid.UUID      	`json:"user_id" 			gorm:"type:uuid;not null"`
	Content     		string    			`json:"content" 			gorm:"null"`
	Visibility  		string    			`json:"visibility"`
	Image       		string    			`json:"image"`
	Score       		float64   			`json:"score"`
	Timestamp   		int64     			`json:"timestamp"
}