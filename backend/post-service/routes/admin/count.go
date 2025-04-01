package public

import (
	"github.com/gofiber/fiber/v2"
	"github.com/google/uuid"
	"post-service/db"
	"post-service/models"
)

func GetAllPostCountHandler(c *fiber.Ctx) error {
	var count int64
	if err := db.DB.Model(&models.Post{}).Where("user_id = ?", userID).Count(&count).Error; err != nil {
		return c.Status(500).JSON(fiber.Map{
			"error": "Failed to get post count",
		})
	}

	return c.JSON(fiber.Map{
		"message":    "Successfully retrieved post count",
		"post_count": count,
	})
}