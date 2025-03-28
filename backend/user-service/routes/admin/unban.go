package admin

import (
	"github.com/gofiber/fiber/v2"

	"user-service/db"
	"user-service/models"
)


func UnbanUserHandler(c *fiber.Ctx) error {
	var unbanReq models.UnbanUserRequest
	if err := c.BodyParser(&unbanReq); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid request body",
		})
	}

	var unbanUser models.Ban
	if err := db.DB.Where("user_id = ?", unbanReq.UserID).First(&unbanUser).Error; err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"error": "User was not banned",
		})
	}

	if err := db.DB.Delete(&unbanUser).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to unban user",
		})
	}

	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"message": "Unban user successfully",
	})
}