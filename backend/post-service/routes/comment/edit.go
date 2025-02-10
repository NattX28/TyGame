package comment

import (
	"github.com/gofiber/fiber/v2"
	"github.com/microcosm-cc/bluemonday"
	"github.com/google/uuid"

	"post-service/db"
	"post-service/models"
)

func EditCommentHandler(c *fiber.Ctx) error {
	postID, err1 := uuid.Parse(c.Params("PostID"))
	commentID, err2 := uuid.Parse(c.Params("CommentID"))
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

	userID, err := uuid.Parse(c.Locals("UserID").(string))
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to get userID",
		})
	}

	// Check Auth
	if (comment.UserID != userID) {
		return c.Status(fiber.StatusForbidden).JSON(fiber.Map{"error": "No Authorization"})
	}

	// Replace Data
	policy := bluemonday.StrictPolicy()
	safeContent := policy.Sanitize(commentReq.Content)
	comment.Content = safeContent

	// Store Data
	if err := db.DB.Save(&comment).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to edit comment"})
	}

	return c.Status(fiber.StatusOK).JSON(fiber.Map{"message": "Comment edited successfully"})
}
