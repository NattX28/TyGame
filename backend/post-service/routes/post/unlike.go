package post

import (
	"strconv"
	"github.com/gofiber/fiber/v2"

	"post-service/db"
	"post-service/models"
)

func UnlikePostHandler(c *fiber.Ctx) error {
	postIDStr := c.Params("PostID")
	postID, err := strconv.Atoi(postIDStr)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid post ID"})
	}

	userID := c.Locals("UserID")
	var likeReq models.Like
	if err := db.DB.Where("user_id = ? AND post_id = ?", userID, postID).First(&likeReq).Error; err != nil {
		return c.Status(fiber.StatusConflict).JSON(fiber.Map{"error": "You have not liked this post before"})
	}

	if err := db.DB.Delete(&likeReq).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to unliked the post"})
	}

	// Return success response
	return c.Status(fiber.StatusOK).JSON(fiber.Map{"message": "Post unliked successfully"})
}
