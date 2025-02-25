package routes

import (
	"log"

	"chat-service/models"
	"chat-service/handler"
	
	"github.com/google/uuid"
	"github.com/gofiber/contrib/websocket"
)

var clients []models.Client

func writeMessages(client *models.Client) {
	for form := range client.Send {
		for _, conn := range client.Conn { // Loop through all connections
			err := conn.WriteJSON(form)
			if err != nil {
				log.Println("Write error:", err)
				conn.Close() // Close the faulty connection
			}
		}
	}
}



func WebSocket(c *websocket.Conn) {
	userID, err := uuid.Parse(c.Locals("UserID").(string))
	if err != nil {
		return 
	}

	client, exists := clients[userID]
	if !exists {
		client = &models.Client{
			UserID: userID,
			Conn:   make([]*websocket.Conn, 0),
			Send:   make(chan []byte),
		}
		clients[userID] = client
	}

	client.Conn = append(client.Conn, c)
	log.Println("New connection for user:", userID)

	go writeMessages(client)

	for {
		var form models.Form
		err := c.ReadJSON(&form)
		if err != nil {
			log.Println("Read error:", err)
			break
		}

		form.Sender = client.UserID

		switch form.Type {
			case "message":
				handler.SendMessage()
			case "event":
				log.Println("Updating friend list for:", client.UserID)
			default:
				log.Println("Unknown command:", form.Cmd)
		}
	}
}