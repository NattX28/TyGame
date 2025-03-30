package post

import (
	"os"
	"github.com/gofiber/fiber/v2"
	"github.com/google/uuid"

	"post-service/db"
	"post-service/models"
)

func DeletePostHandler(c *fiber.Ctx) error {
	postID, err := uuid.Parse(c.Params("PostID"))
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid post ID"})
	}

	Role, ok := c.Locals("Role").(string)
	if !ok {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Authorization Fail"})
	}

	// Pull Data
	var post models.Post
	if err := db.DB.First(&post, postID).Error; err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "Post not found"})
	}

	// Check Auth
	userID, err := uuid.Parse(c.Locals("UserID").(string))
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to get userID",
		})
	}
	if (!(post.UserID == userID || Role == "Admin" || Role == "Super Admin")) {
		return c.Status(fiber.StatusForbidden).JSON(fiber.Map{"error": "No Authorization"})
	}

	if post.Image != "" {
		os.Remove("uploads/posts/" + post.Image);
	}

	// Delete Data
	if err := db.DB.Delete(&post).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to delete post"})
	}

	return c.Status(fiber.StatusOK).JSON(fiber.Map{"message": "Post deleted successfully"})
}
