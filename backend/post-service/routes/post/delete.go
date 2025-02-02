package post

import (
	"github.com/gofiber/fiber/v2"
	"strconv"

	"post-service/db"
	"post-service/models"
)

func DeletePostHandler(c *fiber.Ctx) error {
	postIDStr := c.Params("PostID")
	postID, err := strconv.Atoi(postIDStr)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid post ID"})
	}

	// Pull Data
	var post models.Post
	if err := db.DB.First(&post, postID).Error; err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "Post not found"})
	}

	// Check Auth
	userID := c.Locals("UserID").(uint);
	if post.UserID != userID {
		return c.Status(fiber.StatusForbidden).JSON(fiber.Map{"error": "You are not allowed to edit this post"})
	}

	// Delete Data
	if err := db.DB.Delete(&post).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to delete post"})
	}

	return c.Status(fiber.StatusOK).JSON(fiber.Map{"message": "Post deleted successfully"})
}
