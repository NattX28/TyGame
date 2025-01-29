package main

import (
	"context"
	"log"
	"os"

	"github.com/gofiber/fiber/v2"
	"github.com/joho/godotenv"
	
	"post-service/middleware"
	"post-service/routes"
	"post-service/db"
)

func main() {
	err := godotenv.Load()
	if (err != nil) { log.Println("No .env file found, skipping..."); }
	
	db.Connect()
	defer db.Close()

	app := fiber.New(
		fiber.Config{
			ReadTimeout: 10 * time.Second,
			WriteTimeout: 10 * time.Second,
		}
	)

	v1 := app.Group("/v1")

	posts := v1.Group("/posts")
	posts.Use(middleware.JWTMiddleware)
  posts.Get("/", routes.CreatePostHandler)
  posts.Post("/:community_id", routes.CreatePostHandler)
	posts.Put("/:community_id/:post_id", updatePost)
	posts.Delete("/:community_id/:post_id", deletePost)

	comments := v1.Group("/comments")
	posts.Post("/add", routes.CreatePostHandler)


	likes := v1.Group("/likes")






	log.Fatal(app.Listen(":3000"))
}
