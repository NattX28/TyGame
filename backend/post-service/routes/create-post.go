package routes

import (
	"github.com/gofiber/fiber/v2"

	"post-service/db"
	"post-service/models"
	"log"
)

func CreatePostHandler(c *fiber.Ctx) error {
	// Parse the request body into a Post object
	var post models.Post
	if err := c.BodyParser(&post); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Unable to parse request body",
		})
	}

	// Insert post into the database
	query := `
		INSERT INTO posts (community_id, user_id, content, visibility)
		VALUES ($1, $2, $3, $4)
		RETURNING id, created_at
	`
	var newPost models.Post
	err := database.DB.QueryRow(query, post.CommunityID, post.UserID, post.Content, post.Visibility).Scan(&newPost.ID, &newPost.CreatedAt)
	if err != nil {
		log.Println("Error inserting post: ", err)
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to create post",
		})
	}

	// Respond with the created post data
	return c.Status(fiber.StatusCreated).JSON(fiber.Map{
		"success": "Post created successfully",
	})
}
