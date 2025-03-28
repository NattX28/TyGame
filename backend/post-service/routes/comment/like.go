package comment

import (
	"github.com/gofiber/fiber/v2"
	"github.com/google/uuid"

	"post-service/db"
	"post-service/models"
)

func LikeCommentHandler(c *fiber.Ctx) error {
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

	// Check if already liked the comment
	userID, err := uuid.Parse(c.Locals("UserID").(string))
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to get userID",
		})
	}

	var checkLike models.Like
	if err := db.DB.Where("user_id = ? AND comment_id = ?", userID, commentID).First(&checkLike).Error; err == nil {
		return c.Status(fiber.StatusConflict).JSON(fiber.Map{"error": "You have already liked this comment"})
	}

	likeReq := models.Like{
		UserID: 		userID,
		CommentID: 	&commentID,
	}

	if err := db.DB.Create(&likeReq).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to like the post"})
	}

	// Return success response
	return c.Status(fiber.StatusOK).JSON(fiber.Map{"message": "Comment liked successfully"})
}
