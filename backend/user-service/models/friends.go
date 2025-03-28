package models

import (
	"github.com/google/uuid"
)

type Friend struct {
	ID       uuid.UUID `gorm:"type:uuid;default:gen_random_uuid();primaryKey"`
	UserID   uuid.UUID `gorm:"type:uuid"`
	FriendID uuid.UUID `gorm:"type:uuid"`
}


type FriendResponse struct {
	FriendID 		uuid.UUID `json:"userid"`
	Name     		string    `json:"name"`
	Username    string    `json:"username"`
}