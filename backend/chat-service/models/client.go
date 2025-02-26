package models

import (
	"github.com/google/uuid"
	"github.com/gofiber/contrib/websocket"
)

type Client struct {
	Conn      []*websocket.Conn
	UserID    uuid.UUID
	FriendID  []uuid.UUID
	Send      chan Form
}

type Form struct {
	Type 	string
	Content string
	Sender 	*uuid.UUID
}