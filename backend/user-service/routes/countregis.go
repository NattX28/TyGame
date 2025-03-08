package routes

import (
	"user-service/db"
	"user-service/models"

	"github.com/gofiber/fiber/v2"
)

func GetUserCount(c *fiber.Ctx) error {
	var count int64
	if err := db.DB.Model(&models.User{}).Count(&count).Error; err != nil {
		return c.Status(500).JSON(fiber.Map{
			"error": "Failed to get user count",
		})
	}

	return c.JSON(fiber.Map{
		"message":     "Successfully get user count",
		"user_count": 	count,
	})
}
