package routes

import (
	"log"
	"os"
	"strconv"

	"chat-service/db"
	"chat-service/handler"
	
	"github.com/google/uuid"
	"github.com/gofiber/contrib/websocket"
)

var clients []models.Client

func writeMessages(client *models.Client) {
	for msg := range client.Send {
		for _, conn := range client.Conn { // Loop through all connections
			err := conn.WriteJSON(msg)
			if err != nil {
				fmt.Println("Write error:", err)
				conn.Close() // Close the faulty connection
			}
		}
	}
}



func WebSocket(c *websocket.Conn) {
	userID, err := uuid.Parse(c.Locals("UserID").(string))
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to get userID",
		})
	}

	client, exists := clients[userID]
	if !exists {
		client = &Client{
			UserID: userID,
			Conn:   make([]*websocket.Conn, 0),
			Send:   make(chan []byte),
		}
		clients[userID] = client
	}

	client.Conn = append(client.Conn, c)
	fmt.Println("New connection for user:", userID)

	go writeMessages(client)

	for {
		var msg Message
		err := c.ReadJSON(&msg)
		if err != nil {
			fmt.Println("Read error:", err)
			break
		}

		msg.Sender = client.UserID

		switch msg.Cmd {
			case "send msg":
				handler.SendMessage()

			case "update friend online":
				fmt.Println("Updating friend list for:", client.UserID)
				broadcast(msg)

			default:
				fmt.Println("Unknown command:", msg.Cmd)
		}
	}
}