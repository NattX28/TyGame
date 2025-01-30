package main

import (
	"context"
	"log"
	"os"

	"github.com/gofiber/fiber/v2"
	"github.com/joho/godotenv"
	
	"post-service/middleware"
	"post-service/routes/post"
	"post-service/routes/comment"
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
  posts.Get("/", post.GetPostHandler)
  posts.Post("/", post.CreatePostHandler)

	postFocus := posts.Group("/:post_id")
	postFocus.Put("/", post.EditPostHandler)
	postFocus.Delete("/", post.DeletePostHandler)

	posts_likes := postFocus.Group("/likes")
	posts_likes.Post("/", post.LikePostHandler)
	posts_likes.Delete("/", post.UnlikePostHandler)

	comments := postFocus.Group("/comments")
	comments.Get("/", comment.GetCommentsHandler)
	comments.Post("/", comment.CreateCommentHandler)

	comments_likes := comments.Group("/:comment_id")
	comments.Put("/", comment.EditCommentHandler)
	comments.Delete("/", comment.DeleteCommentHandler)

	comments_likes := comments.Group("/likes")
	comments_likes.Post("/", comment.LikeCommentHandler)
	comments_likes.Delete("/", comment.UnlikeCommentHandler)

	log.Fatal(app.Listen(":3000"))
}
