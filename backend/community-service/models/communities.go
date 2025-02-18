package models

import (
	"time"

	"github.com/google/uuid"
)

type Community struct {
	ID        			uuid.UUID 		`gorm:"type:uuid;default:gen_random_uuid();primaryKey"`
  Name    				string 				`gorm:"not null;unique"`
  Description 		string 				`gorm:"not null"`
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

type CreateCommunityForm struct {
	Name        			string 			`json:"name" 					gorm:"not null;unique"`
	Description 			string 			`json:"description" 	gorm:"not null"`
}
