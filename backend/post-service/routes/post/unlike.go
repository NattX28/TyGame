package post

import (
	"github.com/gofiber/fiber/v2"
	"github.com/google/uuid"

	"post-service/db"
	"post-service/models"
)

func UnlikePostHandler(c *fiber.Ctx) error {
	postID, err := uuid.Parse(c.Params("PostID"))
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid post ID"})
	}

	userID, err := uuid.Parse(c.Locals("UserID").(string))
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to get userID",
		})
	}

	var likeReq models.Like
	if err := db.DB.Where("user_id = ? AND post_id = ?", userID, postID).First(&likeReq).Error; err != nil {
		return c.Status(fiber.StatusConflict).JSON(fiber.Map{"error": "You have not liked this post before"})
	}

	if err := db.DB.Where("user_id = ? AND post_id = ?", userID, postID).Delete(&likeReq).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to unliked the post"})
	}

	// Return success response
	return c.Status(fiber.StatusOK).JSON(fiber.Map{"message": "Post unliked successfully"})
}
