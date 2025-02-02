package post

import (
	"github.com/gofiber/fiber/v2"
	"strconv"

	"post-service/db"
	"post-service/models"
)

func EditPostHandler(c *fiber.Ctx) error {
	postIDStr := c.Params("PostID")
	postID, err := strconv.Atoi(postIDStr)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid post ID"})
	}

	// Pull Data
	var postReq models.Post
	if err := db.DB.First(&postReq, postID).Error; err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "Post not found"})
	}

	// Check Auth
	userID := c.Locals("UserID").(uint);
	if postReq.UserID != userID {
		return c.Status(fiber.StatusForbidden).JSON(fiber.Map{"error": "You are not allowed to edit this post"})
	}

	// Unpack Body To EditPost Form
	var editPostReq EditPostRequest
	if err := c.BodyParser(&editPostReq); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid request body"})
	}

	// Replace Data
	postReq.Content = editPostReq.Content
	postReq.Visibility = editPostReq.Visibility

	// Store Data
	if err := db.DB.Save(&postReq).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to update post"})
	}

	return c.Status(fiber.StatusOK).JSON(fiber.Map{"message": "Post edited successfully"})
}
