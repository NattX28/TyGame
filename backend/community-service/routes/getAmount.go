package routes

import (
	"github.com/gofiber/fiber/v2"
	"community-service/db"
	"community-service/models"
)

func GetAmountCommunities(c *fiber.Ctx) error {
	var count int64
	if err := db.DB.Model(&models.Community{}).Count(&count).Error; err != nil {
		return c.Status(500).JSON(fiber.Map{
			"error": "Failed to get community count",
		})
	}

	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"message":  "Success",
		"amount": count,
	})
}
