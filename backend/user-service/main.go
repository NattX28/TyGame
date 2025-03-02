package main

import (
	"log"
	"os"
	"time"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/joho/godotenv"

	"user-service/db"
	"user-service/friendmanagement"
	"user-service/middleware"
	"user-service/models"
	"user-service/public"
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

	// Auto-migrate User and Friend models
	db.DB.AutoMigrate(&models.User{}, &models.Friend{})

	app := fiber.New(fiber.Config{
		StrictRouting: false,
		ReadTimeout:   10 * time.Second,
		WriteTimeout:  10 * time.Second,
	})

	app.Use(cors.New(cors.Config{
		AllowOrigins: "http://localhost:3000,https://tygame.vercel.app,https://tygame.up.railway.app,https://user-service-tygame.up.railway.app,https://post-service-tygame.up.railway.app,https://community-service-tygame.up.railway.app,https://party-service-tygame.up.railway.app,https://chat-service-tygame.up.railway.app",
		AllowHeaders: "Origin, Content-Type, Accept, Authorization",
		AllowMethods: "GET,POST,PUT,DELETE",
		AllowCredentials: true,
	}))

	// Define public routes
	userRoutes := app.Group("/users")
	userRoutes.Get("/", func(c *fiber.Ctx) error {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"error": "Hello world",
		})
	})

	userRoutes.Get("/count", routes.GetUserCount)
	userRoutes.Post("/register", routes.RegisterHandler)
	userRoutes.Post("/login", routes.LoginHandler)
	userRoutes.Post("/logout", routes.LogoutHandler)
	userRoutes.Post("/refresh-token", routes.RefreshTokenHandler)

	// Define friend management routes (Require JWT)
	friendRoutes := app.Group("/friends")
	friendRoutes.Use(middleware.JWTMiddleware)
	friendRoutes.Post("/add", friendmanagement.AddFriendHandler)
	friendRoutes.Get("/get", friendmanagement.GetFriendsHandler)
	friendRoutes.Delete("/remove", friendmanagement.RemoveFriendHandler)

	// Define protected user routes (Require JWT)
	protectedRoutes := app.Group("/protected")
	protectedRoutes.Use(middleware.JWTMiddleware)
	protectedRoutes.Put("/update", usersmanagement.UpdateUserHandler)
	protectedRoutes.Delete("/delete", usersmanagement.DeleteUserHandler)
	protectedRoutes.Post("/upload-profile", usersmanagement.UploadProfileHandler)
	protectedRoutes.Get("/profile", usersmanagement.GetUserProfileHandler)

	userFocus := userRoutes.Group("/:userID")
	userFocus.Get("/avatar", public.GetAvatarHandler)

	// Handle 404 - catch-all route
	app.Use(func(c *fiber.Ctx) error {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"error": "Route not found",
		})
	})

	port := os.Getenv("PORT_USER_SERVICE")
	if port == "" {
		port = "5001"
	}

	// Start the server
	log.Printf("User-Service starting on port %s", port)
	log.Fatal(app.Listen(":" + port))
}
