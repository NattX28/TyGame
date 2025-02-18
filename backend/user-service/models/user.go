package models

import (
	"github.com/google/uuid"
	"gorm.io/gorm"
)

// User model for authentication (registration & login)
type User struct {
	ID        uuid.UUID `gorm:"type:uuid;default:gen_random_uuid();primaryKey"`
	Username  string    `gorm:"size:255;not null"`
	Email     string    `gorm:"size:255;unique;not null"`
	Password  string    `gorm:"not null"`
	Role      string    `gorm:"size:50;not null;default:'User'"`
	ImageName string    `gorm:"size:255"`
	Name      string    `gorm:"size:255;not null"`
}

// BeforeCreate hook to generate a UUID if not set
func (u *User) BeforeCreate(tx *gorm.DB) error {
	if u.ID == uuid.Nil {
		u.ID = uuid.New()
	}
	return nil
}
