package main

import (
	"log"
	"os"
	"time"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/joho/godotenv"

	"community-service/middleware"

	"community-service/db"
	"community-service/routes"
)

func main() {
	err := godotenv.Load()
	if err != nil {
		log.Println("No .env file found, skipping...")
	}

	imagePath := "./uploads/profile"
	if _, err := os.Stat(imagePath); os.IsNotExist(err) {
		if err := os.MkdirAll(imagePath, os.ModePerm); err != nil {
				return
		}
	}

	db.Connect()
	defer db.Close()

	app := fiber.New(fiber.Config{
		StrictRouting: false,
		ReadTimeout: 10 * time.Second,
		WriteTimeout: 10 * time.Second,
	})
	
	app.Use(cors.New(cors.Config{
		AllowOrigins: "http://localhost:3000,http://localhost:5001,http://localhost:5002,http://localhost:5003,http://localhost:5004,http://localhost:5005,https://tygame.vercel.app,https://tygame.up.railway.app,https://user-service-tygame.up.railway.app,https://post-service-tygame.up.railway.app,https://community-service-tygame.up.railway.app,https://party-service-tygame.up.railway.app,https://chat-service-tygame.up.railway.app",
		AllowHeaders: "Origin, Content-Type, Accept, Authorization",
		AllowMethods: "GET,POST,PUT,DELETE",
		AllowCredentials: true,
	}))

	communities := app.Group("/communities")
	communities.Get("/", func(c *fiber.Ctx) error {
		return c.SendString("Hello World")
	})

	communities.Get("/getall", routes.GetAllCommunities)
	communities.Get("/getamount", routes.GetAmountCommunities)
	communities.Get("/profile/:nameFile", routes.ProfileCommunityHandler)
	communities.Use(middleware.JWTMiddleware)
	communities.Post("/create", middleware.CanManagement, routes.CreateCommunityHandler)

	communities.Post("/getcommus", middleware.CanAccess, routes.GetCommunitiesHandler)

	community_focus := communities.Group("/:CommuID")
	community_focus.Get("/", middleware.CanAccess, routes.GetCommunityHandler)
	community_focus.Post("/", middleware.CanAccess, routes.JoinCommunityHandler)
	community_focus.Put("/", middleware.CanManagement, routes.EditCommunityHandler)
	community_focus.Delete("/", middleware.CanManagement, routes.DeleteCommunityHandler)

	
	community_focus.Get("/members", middleware.CanAccess, routes.GetMemberCommunityHandler)

	port := os.Getenv("PORT_COMMUNITY_SERVICE")
	if port == "" {
		port = "5004"
	}

	log.Printf("Server starting on port %s", port)
	log.Fatal(app.Listen(":" + port))
}

