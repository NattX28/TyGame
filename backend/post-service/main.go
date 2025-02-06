package main

import (
	"time"
	"log"

	"github.com/gofiber/fiber/v2"
	"github.com/joho/godotenv"
	
	"post-service/middleware"
	"post-service/routes/post"
	"post-service/routes/feed"
	"post-service/routes/comment"
	
	"post-service/db"
)

func main() {
	err := godotenv.Load()
	if (err != nil) { log.Println("No .env file found, skipping..."); }
	
	db.Connect()
	defer db.Close()

	app := fiber.New(fiber.Config{
		StrictRouting: false,
		ReadTimeout: 10 * time.Second,
		WriteTimeout: 10 * time.Second,
	})

	v1 := app.Group("/v1")

	feeds := v1.Group("/feeds")
	// feeds.Get("/", middleware.JWTMiddleware, post.LikePostHandler)
	// feeds.Get("community/:CommunityID", feed.GetFeedCommunity)
	// feeds.Get("friend/", middleware.JWTMiddleware, post.LikePostHandler)
	// feeds.Get("friend/:CommunityID", middleware.JWTMiddleware, post.LikePostHandler)

	posts := v1.Group("/posts")
	posts.Use(middleware.JWTMiddleware)
  posts.Post("/", post.CreatePostHandler)

	postFocus := posts.Group("/:PostID")
	postFocus.Put("/", post.EditPostHandler)
	postFocus.Delete("/", post.DeletePostHandler)
	postFocus.Get("/like", post.LikePostHandler)
	postFocus.Get("/unlike", post.UnlikePostHandler)

	comments := postFocus.Group("/comments")
	comments.Get("/", comment.GetCommentsHandler)
	comments.Post("/", comment.CreateCommentHandler)

	commentFocus := postFocus.Group("/:CommentID")
	commentFocus.Put("/", comment.EditCommentHandler)
	commentFocus.Delete("/", comment.DeleteCommentHandler)
	commentFocus.Get("/like", comment.LikeCommentHandler)
	commentFocus.Get("/unlike", comment.UnlikeCommentHandler)

	log.Fatal(app.Listen(":3000"))
}
