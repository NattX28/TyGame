package main

import (
	"log"
	"time"

	"github.com/gofiber/fiber/v2"
	"github.com/joho/godotenv"
	"github.com/gofiber/fiber/v2/middleware/cors"

	"community-service/middleware"

	"community-service/db"
	"community-service/routes"
)

func main() {
	err := godotenv.Load()
	if err != nil {
		log.Println("No .env file found, skipping...")
	}

	db.Connect()
	defer db.Close()

	app := fiber.New(fiber.Config{
		StrictRouting: false,
		ReadTimeout:   10 * time.Second,
		WriteTimeout:  10 * time.Second,
	})
	
	app.Use(cors.New(cors.Config{
		AllowOrigins: "http://localhost:3000,https://tygame.up.railway.app,https://user-service-tygame.up.railway.app,https://post-service-tygame.up.railway.app,https://community-service-tygame.up.railway.app,https://party-service-tygame.up.railway.app",
		AllowHeaders: "Origin, Content-Type, Accept, Authorization",
		AllowMethods: "GET,POST,PUT,DELETE",
		AllowCredentials: true,
	}))

	communities := app.Group("/communities")
	communities.Use(middleware.JWTMiddleware)
	communities.Get("/getall", middleware.CanAccess, routes.GetAllCommunities)
	communities.Post("/create", middleware.CanManagement, routes.CreateCommunityHandler)

	community_focus := communities.Group("/:CommuID")
	community_focus.Get("/", middleware.CanAccess, routes.GetCommunityHandler)
	community_focus.Post("/", middleware.CanManagement, routes.JoinCommunityHandler)
	community_focus.Put("/", middleware.CanManagement, routes.EditCommunityHandler)
	community_focus.Delete("/", middleware.CanManagement, routes.DeleteCommunityHandler)

	log.Fatal(app.Listen(":3000"))
}

