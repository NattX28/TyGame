package comment

import (
	"github.com/gofiber/fiber/v2"
	"github.com/microcosm-cc/bluemonday"
	"github.com/google/uuid"

	"post-service/db"
	"post-service/models"
)

func CreateCommentHandler(c *fiber.Ctx) error {
	postID, err := uuid.Parse(c.Params("PostID"))
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid post ID"})
	}
	
	var commentForm models.CommentFormReq
	if err := c.BodyParser(&commentForm); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid request body"})
	}

	// Pull Data
	var postReq models.Post
	if err := db.DB.First(&postReq, postID).Error; err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "Post not found"})
	}

	userID, ok := c.Locals("UserID").(uuid.UUID)
	if !ok {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid UserID"})
	}

	// Can Access
	if (postReq.Visibility != "public") {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "Cant access this post"})
	}

	policy := bluemonday.StrictPolicy()
	safeContent := policy.Sanitize(commentForm.Content)

	comment := models.Comment{
		PostID: 		 postID,
		UserID:      userID,
		Content:     safeContent,
	}

	// Store Data
	result := db.DB.Create(&comment)
	if result.Error != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to create comment"})
	}
	
	return c.Status(fiber.StatusOK).JSON(fiber.Map{"message": "Comment created successfully"})
}