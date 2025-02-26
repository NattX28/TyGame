package models

import (
	"github.com/google/uuid"
	"github.com/gofiber/contrib/websocket"
)

type Client struct {
	Conn      []*websocket.Conn
	UserID    uuid.UUID
	FriendID  []uuid.UUID
	Send      chan FormResponse
}

type Form struct {
	Event 	string
	Content string
	RoomID	string
}

type FormResponse struct {
	Event 	string
	Content string
	RoomID	uuid.UUID
	SenderID uuid.UUID
	Timestamp		int64
}