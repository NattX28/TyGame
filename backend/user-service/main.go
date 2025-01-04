package main

import (
	"log"

	"github.com/gofiber/fiber/v2"
	"github.com/joho/godotenv"

	"user-service/db"
	"user-service/routes"
)

func main() {
	// Load environment variables
	err := godotenv.Load()
	if err != nil {
		log.Println("No .env file found, skipping...")
	}

	// Connect to the database
	db.Connect()
	defer db.Close()

	// Create the users table
	db.CreateUsersTable() // Call the function to create the users table

	// Initialize Fiber app
	app := fiber.New()

	// Define routes
	userRoutes := app.Group("/users")
	userRoutes.Post("/register", routes.RegisterHandler)
	userRoutes.Post("/login", routes.LoginHandler)
	userRoutes.Get("/friends", routes.GetFriendsHandler)

	// Handle 404
	app.Use(func(c *fiber.Ctx) error {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"error": "Route not found",
		})
	})

	// Start the server
	log.Fatal(app.Listen(":3000"))
}
