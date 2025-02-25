package handler

import (
	"log"
	"chat-service/models"
)


func SendMessage(client *models.Client, form models.Form) {
	log.Println("Message received:", form.Content)
	client.Send <- form
}