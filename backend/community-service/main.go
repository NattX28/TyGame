package main

import (
	"log"
	"time"

	"github.com/gofiber/fiber/v2"
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

	db.Connect()
	defer db.Close()

	app := fiber.New(fiber.Config{
		StrictRouting: false,
		ReadTimeout:   10 * time.Second,
		WriteTimeout:  10 * time.Second,
	})

	v1 := app.Group("/v1")

	communities := v1.Group("/communities")
	communities.Use(middleware.JWTMiddleware)
	communities.Get("/", middleware.CanAccess, routes.GetAllCommunities)
	communities.Post("/", middleware.CanManagement, routes.CreateCommunityHandler)

	community_focus := communities.Group("/:CommuID")
	community_focus.Get("/", middleware.CanAccess, routes.GetCommunityHandler)
	community_focus.Post("/", middleware.CanManagement, routes.JoinCommunityHandler)
	community_focus.Put("/", middleware.CanManagement, routes.EditCommunityHandler)
	community_focus.Delete("/", middleware.CanManagement, routes.DeleteCommunityHandler)

	log.Fatal(app.Listen(":3000"))
}

