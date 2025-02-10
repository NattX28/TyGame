package comment

import (
	"github.com/gofiber/fiber/v2"
	"github.com/google/uuid"

	"post-service/db"
	"post-service/models"
)

func GetCommentsHandler(c *fiber.Ctx) error {
	postID, err := uuid.Parse(c.Params("PostID"))
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid post ID"})
	}

	// Pull Data
	var postReq models.Post
	if err := db.DB.First(&postReq, postID).Error; err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "Post not found"})
	}

	userID, err := uuid.Parse(c.Locals("UserID").(string))
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to get userID",
		})
	}

	// Can Access
	if (postReq.Visibility != "public" && postReq.UserID != userID) {
		return c.Status(fiber.StatusForbidden).JSON(fiber.Map{"error": "No Authorization"})
	}

	var comments []models.CommentFormRes
	result := db.DB.
		Model(&models.Comment{}).
		Select("comments.id, comments.user_id, comments.content, EXTRACT(EPOCH FROM comments.created_at) AS created_at_unix, COUNT(likes.id) AS like_count").
		Joins("LEFT JOIN likes ON likes.comment_id = comments.id").
		Where("comments.post_id = ?", postReq.ID).
		Group("comments.id").
		Order("comments.created_at DESC").
		Find(&comments)
	if result.Error != nil {
		return result.Error
	}

	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"message": "Pull comment successfully",
		"comments": comments,
	})
}
