package main

import (
	"log"
	"os"

	"chat-service/db"
	"chat-service/routes"
	"chat-service/middleware"

	"github.com/gofiber/contrib/websocket"
	"github.com/gofiber/fiber/v2"
	"github.com/joho/godotenv"
)


func main() {
    err := godotenv.Load()
    if err != nil {
        log.Println("No .env file found")
    }

    db.Connect()
    defer db.Close()

    app := fiber.New()
    app.Use(middleware.JWTMiddleware)

    app.Get("/ws", websocket.New(routes.WebSocket))

    app.Post("/rooms/create", routes.CreateRoom)
    app.Post("/rooms/recent", routes.GetRecentRoom)
    app.Post("/users/block", routes.BlockUser)

    port := os.Getenv("PORT_CHAT_SERVICE")
    if port == "" {
        port = "5005"
    }

    log.Printf("Server starting on port %s", port)
    log.Fatal(app.Listen(":" + port))
}