package main

import (
	"log"
	"os"
	"party-service/db"
	
	"party-service/websocket"
	"github.com/joho/godotenv"
	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/contrib/websocket"
)

func main() {
	err := godotenv.Load()
	if err != nil {
		log.Println("No .env file found, skipping...")
	}

	db.Connect()
	defer db.Close()

	hub := websocket.NewHub()
	go hub.Run()

	app := fiber.New()

	app.Post("/party", handler.CreatePartyHandler)

	app.Get("/ws", websocket.New(func(c *websocket.Conn) {
		websocket.ServeWs(hub, c)
	}))

	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	log.Println("Party Service running on port", port)
	log.Fatal(app.Listen(":" + port))
}
