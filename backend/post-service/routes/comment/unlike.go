package comment

import (
	"github.com/gofiber/fiber/v2"
	"github.com/google/uuid"

	"post-service/db"
	"post-service/models"
)

func UnlikeCommentHandler(c *fiber.Ctx) error {
	// postID, err1 := uuid.Parse(c.Params("PostID"))
	commentID, err2 := uuid.Parse(c.Params("CommentID"))
	if err2 != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid Param"})
	}

	userID, ok := c.Locals("UserID").(uuid.UUID)
	if !ok {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid UserID"})
	}

	var likeReq models.Like
	if err := db.DB.Where("user_id = ? AND comment_id = ?", userID, commentID).First(&likeReq).Error; err != nil {
		return c.Status(fiber.StatusConflict).JSON(fiber.Map{"error": "You have not liked this comment before"})
	}

	if err := db.DB.Delete(&likeReq).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to unliked the comment"})
	}

	// Return success response
	return c.Status(fiber.StatusOK).JSON(fiber.Map{"message": "Comment unliked successfully"})
}
