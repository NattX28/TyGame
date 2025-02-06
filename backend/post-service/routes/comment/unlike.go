package post

import (
	"strconv"
	"github.com/gofiber/fiber/v2"

	"post-service/db"
	"post-service/models"
)

func UnlikePostHandler(c *fiber.Ctx) error {
	postIDStr := c.Params("PostID")
	commentIDStr := c.Params("CommentID")
	postID, err1 := strconv.Atoi(postIDStr)
	commentID, err2 := strconv.Atoi(commentIDStr)
	if err1 != nil || err2 != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid Param"})
	}

	userID := c.Locals("UserID")
	var likeReq models.Like
	if err := db.DB.Where("user_id = ? AND comment_id = ?", userID, CommentID).First(&likeReq).Error; err != nil {
		return c.Status(fiber.StatusConflict).JSON(fiber.Map{"error": "You have not liked this comment before"})
	}

	if err := db.DB.Delete(&likeReq).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to unliked the comment"})
	}

	// Return success response
	return c.Status(fiber.StatusOK).JSON(fiber.Map{"message": "Comment unliked successfully"})
}
