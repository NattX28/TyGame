package main

import (
	"os"
	"log"
    "time"

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

    app := fiber.New(fiber.Config{
		StrictRouting: false,
		ReadTimeout: 10 * time.Second,
		WriteTimeout: 10 * time.Second,
	})

    app.Use(cors.New(cors.Config{
		AllowOrigins: "http://localhost:3000,https://tygame.vercel.app,https://tygame.up.railway.app,https://user-service-tygame.up.railway.app,https://post-service-tygame.up.railway.app,https://community-service-tygame.up.railway.app,https://party-service-tygame.up.railway.app,https://chat-service-tygame.up.railway.app",
		AllowHeaders: "Origin, Content-Type, Accept, Authorization",
		AllowMethods: "GET,POST,PUT,DELETE",
		AllowCredentials: true,
	}))

    app.Use(middleware.JWTMiddleware)

	chatService := app.Group("/chat")

    chatService.Get("/ws", websocket.New(routes.WebSocket))

    chatService.Post("/users/block", routes.BlockUser)
    
    chatService.Post("/rooms/create", routes.CreateRoom)
    chatService.Post("/rooms/contact", routes.GetRecentRoom)

    chatService.Get("/rooms/:room_id/", routes.GetMessages)

    port := os.Getenv("PORT_CHAT_SERVICE")
    if port == "" {
        port = "5005"
    }

    log.Printf("Server starting on port %s", port)
    log.Fatal(app.Listen(":" + port))
}