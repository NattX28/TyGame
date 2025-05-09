package main

import (
	"log"
	"os"
	"time"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/joho/godotenv"

	"post-service/middleware"
	"post-service/public"
	"post-service/routes/comment"
	"post-service/routes/feed"
	"post-service/routes/post"

	"post-service/db"
)

func main() {
	err := godotenv.Load()
	if (err != nil) { log.Println("No .env file found, skipping..."); }
	
	filePath := "./uploads/posts"
	if _, err := os.Stat(filePath); os.IsNotExist(err) {
		if err := os.MkdirAll(filePath, os.ModePerm); err != nil {
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


	posts := app.Group("/posts")
	posts.Use(middleware.JWTMiddleware)
	posts.Post("/", middleware.CheckUseBanned, post.CreatePostHandler)
	posts.Get("/image/:nameFile", public.GetImageHandler)
	posts.Get("/count/:userID", public.GetPostCountHandler)

	posts.Get("/admin/getstatposts", middleware.CanAccess, public.GetAllPostEachCommu)

	feeds := posts.Group("/feeds")
	// feeds.Get("/", middleware.JWTMiddleware, post.LikePostHandler)
	feeds.Get("community/:CommunityID", feed.GetFeedCommunity)
	feeds.Get("user/:UserID", feed.GetFeedUser)
	// feeds.Get("friend/:CommunityID", middleware.JWTMiddleware, post.LikePostHandler)

	postFocus := posts.Group("/:PostID")
	postFocus.Use(middleware.CheckUseBanned)
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

	port := os.Getenv("PORT_POST_SERVICE")
  if port == "" {
    port = "5002"
  }
	log.Printf("Server starting on port %s", port)
	log.Fatal(app.Listen(":" + port))
}
