package handler

import (
	"chat-service/db"
)


func SendMessage(c *websocket.Conn) {
	fmt.Println("Message received:", msg.Content)
	client.Send <- msg
}