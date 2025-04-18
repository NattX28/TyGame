package models

import (
	"time"

	"github.com/google/uuid"
)

type Community struct {
	ID        			uuid.UUID 		`gorm:"type:uuid;default:gen_random_uuid();primaryKey"`
	Name    				string 				`gorm:"not null;unique"`
	Description 		string 				`gorm:"not null"`
	Category				string				`gorm:"not null"`
	Image 					string 				`gorm:"not null"`
	CreatorID       uuid.UUID			`gorm:"not null"`
	CreatedAt 			time.Time 		`gorm:"default:current_timestamp"`
}

type CommunityMember struct {
	UserID      		uuid.UUID			`gorm:"not null;uniqueIndex:idx_community_user"`
	CommunityID 		uuid.UUID			`gorm:"not null;uniqueIndex:idx_community_user"`
	CreatedAt   		time.Time			`gorm:"default:current_timestamp"`

	Community   		Community			`gorm:"foreignKey:CommunityID;references:ID;constraint:OnDelete:CASCADE"`
}

type ReqCommunityForm struct {
	Name        	string 			`json:"name" 					gorm:"not null;unique"`
	Description 	string 			`json:"description" 	gorm:"not null"`
	Category    	string    	`json:"category"			gorm:"not null"`
}

type CommunityResponse struct {
	ID          	uuid.UUID 	`json:"uuid"`
	Name        	string    	`json:"name"`
	Description 	string    	`json:"description"`
	Category    	string    	`json:"category"`
	Image    			string    	`json:"image"`
}

type CommunityResponseAdmin struct {
	ID          	uuid.UUID 	`json:"uuid"`
	Name        	string    	`json:"name"`
	Description 	string    	`json:"description"`
	Category    	string    	`json:"category"`
	Image    			string    	`json:"image"`
	MemberCount 	int64     	`json:"member_count"`
	PostCount   	int64     	`json:"post_count"`
}
