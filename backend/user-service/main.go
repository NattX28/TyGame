package main

import (
	"log"

	"github.com/gofiber/fiber/v2"
	"github.com/joho/godotenv"

	"user-service/db"
	"user-service/friendmanagement"
	"user-service/middleware"
	"user-service/models"
	"user-service/routes"
	"user-service/usersmanagement"
)

func main() {
	err := godotenv.Load()
	if err != nil {
		log.Println("No .env file found, skipping...")
	}

	// Connect to the database
	db.Connect()

	// Auto-migrate User model to ensure the table exists
	db.DB.AutoMigrate(&models.User{})
	db.DB.AutoMigrate(&models.Friend{})

	app := fiber.New()

	// Define public routes
	userRoutes := app.Group("/users")
	userRoutes.Post("/register", routes.RegisterHandler)
	userRoutes.Post("/login", routes.LoginHandler)
	userRoutes.Post("/logout", routes.LogoutHandler)
	userRoutes.Post("/refresh-token", routes.RefreshTokenHandler)

	// Define friend management routes
	friendRoutes := app.Group("/friends")
	friendRoutes.Use(middleware.JWTMiddleware)
	friendRoutes.Post("/add", friendmanagement.AddFriendHandler)
	friendRoutes.Get("/get", friendmanagement.GetFriendsHandler)
	friendRoutes.Delete("/remove", friendmanagement.RemoveFriendHandler)

	// Define protected routes (require JWT)
	protectedRoutes := app.Group("/protected")
	protectedRoutes.Use(middleware.JWTMiddleware)
	protectedRoutes.Put("/update", usersmanagement.UpdateUserHandler)
	protectedRoutes.Delete("/delete", usersmanagement.DeleteUserHandler)

	// Handle 404 - catch-all route
	app.Use(func(c *fiber.Ctx) error {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"error": "Route not found",
		})
	})

	// Start the server
	log.Fatal(app.Listen(":3000"))
}
