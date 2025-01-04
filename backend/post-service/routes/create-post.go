package routes

import (
	"github.com/gofiber/fiber/v2"
	"post-service/db" // Import the db package
	"log"
)

func CreatePostHandler(c *fiber.Ctx) error {
	var post struct {
		Title   string `json:"title"`
		Content string `json:"content"`
	}

	if err := c.BodyParser(&post); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Cannot parse JSON",
		})
	}

	sql := `INSERT INTO posts (title, content) VALUES ($1, $2)`
	_, err := db.DB.Exec(c.Context(), sql, post.Title, post.Content)
	if err != nil {
		log.Printf("Failed to insert post: %v", err)
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to create post",
		})
	}

	return c.Status(fiber.StatusCreated).JSON(fiber.Map{
		"message": "Post created successfully",
	})
}
