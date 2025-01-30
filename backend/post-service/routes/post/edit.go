package post

import (
	"github.com/gofiber/fiber/v2"
	"strconv"

	"post-service/db"
	"post-service/models"
)

func EditPostHandler(c *fiber.Ctx) error {
	postIDStr := c.Params("post_id")
	postID, err := strconv.Atoi(postIDStr)
	
	var post models.Post
	if err := db.DB.First(&post, postID).Error; err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "Post not found"})
	}

	if err := c.BodyParser(&post); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid request body"})
	}

	if err := db.DB.Save(&post).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to update post"})
	}

	return c.Status(fiber.StatusOK).JSON(fiber.Map{"message": "Post edited successfully"})
}
