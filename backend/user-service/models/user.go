package models

import (
	"github.com/google/uuid"
	"gorm.io/gorm"
)

// User model for authentication (registration & login)
type User struct {
	ID            uuid.UUID `gorm:"type:uuid;default:gen_random_uuid();primaryKey"`
	Username      string    `gorm:"size:255;not null"`
	Email         string    `gorm:"size:255;unique;not null"`
	Password      string    `gorm:"not null"`
	Role          string    `gorm:"size:50;not null;default:'User'"`
	ImageName     string    `gorm:"size:255"`
	Name          string    `gorm:"size:255;not null"`
	CookieVersion int       `gorm:"default:0;not null"` // Auto-incrementing version field
	Description   string    `gorm:"size:255"`           // A new field to describe the user
}

// BeforeCreate hook to generate a UUID if not set
func (u *User) BeforeCreate(tx *gorm.DB) error {
	if u.ID == uuid.Nil {
		u.ID = uuid.New()
	}
	return nil
}

// BeforeUpdate hook to increment the cookie_version on update
func (u *User) BeforeUpdate(tx *gorm.DB) error {
	// Increment the cookie_version each time the user record is updated
	u.CookieVersion++
	return nil
}
