package comment

import (
	"github.com/gofiber/fiber/v2"
	"github.com/google/uuid"

	"post-service/db"
	"post-service/models"
)

func DeleteCommentHandler(c *fiber.Ctx) error {
	postID, err1 := uuid.Parse(c.Params("PostID"))
	commentID, err2 := uuid.Parse(c.Params("CommentID"))
	if err1 != nil || err2 != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid Param"})
	}

	// Pull Comment
	var comment models.Comment
	if err := db.DB.Where("post_id = ? AND id = ?", postID, commentID).First(&comment).Error; err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "Comment not found"})
	}

	// Check Auth
	userID, err := uuid.Parse(c.Locals("UserID").(string))
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to get userID",
		})
	}

	Role, ok := c.Locals("Role").(string)
	if !ok {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Authorization Fail"})
	}

	if !(comment.UserID == userID || Role == "Admin" || Role == "Super Admin") {
		return c.Status(fiber.StatusForbidden).JSON(fiber.Map{"error": "No Authorization"})
	}

	// Delete Data
	if err := db.DB.Delete(&comment).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to delete comment"})
	}

	return c.Status(fiber.StatusOK).JSON(fiber.Map{"message": "Comment edited successfully"})
}
