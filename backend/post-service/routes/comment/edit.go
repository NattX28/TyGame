package post

import (
	"strconv"
	"github.com/gofiber/fiber/v2"
	"github.com/microcosm-cc/bluemonday"

	"post-service/db"
	"post-service/models"
)

func EditCommentHandler(c *fiber.Ctx) error {
	postIDStr := c.Params("PostID")
	commentIDStr := c.Params("CommentID")
	postID, err1 := strconv.Atoi(postIDStr)
	commentID, err2 := strconv.Atoi(commentIDStr)
	if err1 != nil || err2 != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid Param"})
	}

	// Unpack Body To CommentFormReq
	var commentReq models.CommentFormReq
	if err := c.BodyParser(&commentReq); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid request body"})
	}

	// Pull Comment
	var comment models.Comment
	if err := db.DB.Where("post_id = ? AND id = ?", postID, commentID).First(&comment).Error; err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "Comment not found"})
	}

	userID := c.Locals("UserID")

	// Check Auth
	if (comment.UserID != userID) {
		return c.Status(fiber.StatusForbidden).JSON(fiber.Map{"error": "No Authorization"})
	}

	// Replace Data
	policy := bluemonday.StrictPolicy()
	safeContent := policy.Sanitize(commentReq.Content)
	comment.Content = safeContent

	// Store Data
	if err := db.DB.Save(&postReq).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to edit comment"})
	}

	return c.Status(fiber.StatusOK).JSON(fiber.Map{"message": "Comment edited successfully"})
}
