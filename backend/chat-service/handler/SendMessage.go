package handler

import (
	"chat-service/models"
)


func SendMessage(client *models.Client) {
	fmt.Println("Message received:", msg.Content)
	client.Send <- msg
}