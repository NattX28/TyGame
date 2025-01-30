package post

import (
	"github.com/gofiber/fiber/v2"

	"post-service/db"
	"post-service/models"
)

func CreatePostHandler(c *fiber.Ctx) error {
	var post models.Post

	if err := c.BodyParser(&post); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid request body"})
	}

	result := db.DB.Create(&post)
	if result.Error != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to create post"})
	}

	return c.Status(fiber.StatusCreated).JSON(fiber.Map{"message": "Post created successfully"})
}