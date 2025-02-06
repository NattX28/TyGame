package post

import (
	"strconv"
	"github.com/gofiber/fiber/v2"

	"post-service/db"
	"post-service/models"
)

func DeleteCommentHandler(c *fiber.Ctx) error {
	postIDStr := c.Params("PostID")
	postID, err := strconv.Atoi(postIDStr)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid post ID"})
	}
	commentIDStr := c.Params("CommentID")
	commentID, err := strconv.Atoi(commentIDStr)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid comment ID"})
	}

	// Pull Comment
	var comment models.Comment
	if err := db.DB.Where("post_id = ? AND id = ?", postID, commentID).First(&comment).Error; err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "Comment not found"})
	}

	// Check Auth
	userID := c.Locals("UserID")
	if (comment.UserID != userID) {
		return c.Status(fiber.StatusForbidden).JSON(fiber.Map{"error": "No Authorization"})
	}

	// Delete Data
	if err := db.DB.Delete(&comment).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to delete comment"})
	}

	return c.Status(fiber.StatusOK).JSON(fiber.Map{"message": "Comment edited successfully"})
}
