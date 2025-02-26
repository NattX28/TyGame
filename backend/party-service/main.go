package main

import (
	"log"
	"os"
	"strconv"

	"party-service/db"
	"party-service/handler"
	"party-service/middleware"
	wsServer "party-service/websocket" // change name import

	"github.com/gofiber/contrib/websocket"
	"github.com/gofiber/fiber/v2"
	"github.com/google/uuid"
	"github.com/joho/godotenv"
	"github.com/gofiber/fiber/v2/middleware/cors"
)

func main() {
    err := godotenv.Load()
    if err != nil {
        log.Println("No .env file found")
    }

    db.Connect()
    defer db.Close()

    hub := wsServer.NewHub()
    go hub.Run()

    app := fiber.New()

    app.Use(cors.New(cors.Config{
        AllowOrigins: "http://localhost:3000,https://tygame.up.railway.app,https://user-service-tygame.up.railway.app,https://post-service-tygame.up.railway.app,https://community-service-tygame.up.railway.app,https://party-service-tygame.up.railway.app",
        AllowHeaders: "Origin, Content-Type, Accept, Authorization",
        AllowMethods: "GET,POST,PUT,DELETE",
        AllowCredentials: true,
    }))

    app.Use(middleware.JWTMiddleware)

    // Websocket middleware
    app.Use("/ws", func(c *fiber.Ctx) error {
        // IsWebSocketUpgrade returns true if the client
        // requested upgrade to the WebSocket protocol.
        if websocket.IsWebSocketUpgrade(c) {
            return c.Next()
        }
        return fiber.ErrUpgradeRequired
    })

    app.Post("/party/find", handler.FindPartyHandler)
    
    app.Get("/ws/:party_id", websocket.New(func(c *websocket.Conn) {
        partyID := c.Params("party_id")
        userID := c.Query("user_id")
        
        partyIDUint, _ := strconv.ParseUint(partyID, 10, 64)
        userIDUUID, _ := uuid.Parse(userID)
        
        wsServer.ServeWs(hub, c, uint(partyIDUint), userIDUUID)
    }))

    port := os.Getenv("PORT_PARTY_SERVICE")
    if port == "" {
        port = "5005"
    }

    log.Printf("Server starting on port %s", port)
    log.Fatal(app.Listen(":" + port))
}