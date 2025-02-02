package post

import (
	"strconv"
	"github.com/gofiber/fiber/v2"
	"github.com/microcosm-cc/bluemonday"

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
	var editPostReq models.EditPostRequest
	if err := c.BodyParser(&editPostReq); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid request body"})
	}

	// Replace Data
	policy := bluemonday.StrictPolicy()
	safeContent := policy.Sanitize(editPostReq.Content)
	postReq.Content = safeContent
	postReq.Visibility = editPostReq.Visibility

	// Store Data
	if err := db.DB.Save(&postReq).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to update post"})
	}

	return c.Status(fiber.StatusOK).JSON(fiber.Map{"message": "Post edited successfully"})
}
