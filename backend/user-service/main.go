package main

import (
	"log"

	"github.com/gofiber/fiber/v2"
	"github.com/joho/godotenv"

	"user-service/db"
	"user-service/middleware"
	"user-service/models" // Import the models package
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

	// Auto-migrate User model to ensure the table exists
	db.DB.AutoMigrate(&models.User{}) // Use models.User instead of db.User

	// Initialize Fiber app
	app := fiber.New()

	// Define public routes
	userRoutes := app.Group("/users")
	userRoutes.Post("/register", routes.RegisterHandler)
	userRoutes.Post("/login", routes.LoginHandler)
	userRoutes.Post("/logout", routes.LogoutHandler)
	userRoutes.Post("/refresh-token", routes.RefreshTokenHandler)

	// Define protected routes (require JWT)
	protectedRoutes := app.Group("/protected")
	protectedRoutes.Use(middleware.JWTMiddleware)

	// Handle 404 - catch-all route
	app.Use(func(c *fiber.Ctx) error {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"error": "Route not found",
		})
	})

	// Start the server
	log.Fatal(app.Listen(":3000"))
}
