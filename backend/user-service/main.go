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
	"user-service/routes/admin"
	"user-service/usersmanagement"
)

func main() {
	err := godotenv.Load()
	if err != nil {
		log.Println("No .env file found, skipping...")
	}

	filePath := "./uploads/users"
	if _, err := os.Stat(filePath); os.IsNotExist(err) {
		if err := os.MkdirAll(filePath, os.ModePerm); err != nil {
				return
		}
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
		AllowOrigins: "http://localhost:3000,http://localhost:5001,http://localhost:5002,http://localhost:5003,http://localhost:5004,http://localhost:5005,https://tygame.vercel.app,https://tygame.up.railway.app,https://user-service-tygame.up.railway.app,https://post-service-tygame.up.railway.app,https://community-service-tygame.up.railway.app,https://party-service-tygame.up.railway.app,https://chat-service-tygame.up.railway.app",
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

	userRoutes.Post("/register", routes.RegisterHandler)
	userRoutes.Post("/login", routes.LoginHandler)
	userRoutes.Post("/logout", routes.LogoutHandler)
	userRoutes.Post("/refresh-token", routes.RefreshTokenHandler)
	userRoutes.Post("/getusersdata", public.GetUsersDataHandler)

	adminRoutes := userRoutes.Group("/admin")
	adminRoutes.Use(middleware.JWTMiddleware)
	adminRoutes.Use(middleware.CanManagement)
	adminRoutes.Get("/count", routes.GetUserCount)
	adminRoutes.Get("/recent-register", routes.GetUserRegistrationStats)
	adminRoutes.Post("/ban", admin.BanUserHandler)
	adminRoutes.Post("/unban", admin.UnbanUserHandler)
	adminRoutes.Post("/getusersdata", admin.GetUsersDataHandler)
	
	userFocus := userRoutes.Group("/:userID")
	userFocus.Get("/avatar", public.GetAvatarHandler)
	userFocus.Get("/checkban", admin.CheckUseBanned)
	userFocus.Use(middleware.JWTMiddleware)
	userFocus.Get("/", public.GetUserDataHandler)

	// Define friend management routes (Require JWT)
	friendRoutes := userRoutes.Group("/friends")
	friendRoutes.Use(middleware.JWTMiddleware)
	friendRoutes.Get("/get", friendmanagement.GetFriendsHandler)
	friendRoutes.Post("/add", friendmanagement.AddFriendHandler)
	friendRoutes.Delete("/remove", friendmanagement.RemoveFriendHandler)
	friendRoutes.Get("/:userID/check", friendmanagement.CheckFriendsHandler)
	friendRoutes.Get("/:userID/count", friendmanagement.CountFriendsHandler)

	// Define protected user routes (Require JWT)
	protectedRoutes := userRoutes.Group("/protected")
	protectedRoutes.Use(middleware.JWTMiddleware)
	protectedRoutes.Put("/update", usersmanagement.UpdateUserHandler)
	protectedRoutes.Post("/upload-profile", usersmanagement.UploadProfileHandler)
	protectedRoutes.Get("/profile", usersmanagement.GetUserProfileHandler)


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
