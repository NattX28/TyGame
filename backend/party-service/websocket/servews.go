package websocket

import (
	"github.com/gofiber/contrib/websocket"
	"github.com/google/uuid"
	"log"
)

func ServeWs(hub *Hub, c *websocket.Conn, partyID uint, userID uuid.UUID) {
	log.Printf("New WebSocket connection: Party ID: %d, User ID: %s", partyID, userID)

	client := &Client{
		Conn:    c,
		PartyID: partyID,
		UserID:  userID,
		Send:    make(chan []byte, 256),
	}

	log.Printf("Closing WebSocket connection: Party ID: %d, User ID: %s", partyID, userID)
	hub.Register <- client

	// defer เพื่อให้แน่ใจว่า connection จะถูก close เมื่อจบ function
	defer func() {
		log.Printf("Closing WebSocket connection: Party ID: %d, User ID: %s", partyID, userID)
		hub.Unregister <- client
		c.Close()
	}()

	go client.writePump()
	client.readPump(hub) // blocking call
}