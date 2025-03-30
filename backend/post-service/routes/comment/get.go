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
	query := `
		SELECT comments.id, comments.post_id, comments.user_id, comments.content, comments.timestamp, 
		       COUNT(likes.id) AS like_count,
		       EXISTS(SELECT 1 FROM likes WHERE likes.comment_id = comments.id AND user_id = ?) AS Liked
		FROM comments
		LEFT JOIN likes ON likes.comment_id = comments.id
		WHERE comments.post_id = ?
		GROUP BY comments.id
		ORDER BY comments.timestamp DESC
	`
	result := db.DB.Raw(query, userID, postReq.ID).Scan(&comments)
	if result.Error != nil {
		return result.Error
	}

	if (len(comments) == 0) {
		comments = []models.CommentFormRes{}
	}

	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"message": "Pull comment successfully",
		"comments": comments,
	})
}
