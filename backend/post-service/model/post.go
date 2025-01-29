package models

import "time"

type Post struct {
	ID          int       `json:"id"`
	CommunityID int       `json:"community_id"`
	UserID      int       `json:"user_id"`
	Content     string    `json:"content"`
	Visibility  string    `json:"visibility"`
	CreatedAt   time.Time `json:"created_at"`
}
