package main

import (
	"context"
	"log"
	"os"

	"github.com/gofiber/fiber/v2"
	"github.com/joho/godotenv"
	
	"post-service/routes"
	"post-service/db"
)

func main() {
	err := godotenv.Load()
	if (err != nil) { log.Println("No .env file found, skipping..."); }
	
	db.Connect()
	defer db.Close()



	app := fiber.New()

	posts := app.Group("/posts")
  posts.Post("/create", routes.CreatePostHandler)


	log.Fatal(app.Listen(":3000"))
}
