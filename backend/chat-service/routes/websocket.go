package handler

import (
	"log"
	"os"
	"strconv"

	"chat-service/db"
	"chat-service/handler"

	"github.com/gofiber/contrib/websocket"
)

func writeMessages(client *Client) {
	for msg := range client.Send {
		err := client.Conn.WriteJSON(msg)
		if err != nil {
			fmt.Println("Write error:", err)
			break
		}
	}
}


func WebSocket(c *websocket.Conn) {
	userID := uuid.New()

	client, exists := clients[userID]
	if !exists {
		client = &Client{
			UserID: userID,
			Conn:   []*websocket.Conn{},
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

	delete(clients, userID)
	close(client.Send)
	c.Close()
}