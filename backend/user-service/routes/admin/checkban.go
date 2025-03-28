package admin

import (
	"time"
	"github.com/gofiber/fiber/v2"
	"github.com/google/uuid"

	"user-service/db"
	"user-service/models"
)

func CheckUseBanned(c *fiber.Ctx) error {
	userID, err := uuid.Parse(c.Params("userID"))
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Failed to parse userID from parameters",
		})
	}

	var banRecord models.Ban
	if err := db.DB.Where("user_id = ?", userID).First(&banRecord).Error; err != nil {
		return c.Status(fiber.StatusOK).JSON(fiber.Map{
			"message": "User was not banned",
		})
	}

	if banRecord.Timestamp > time.Now().Unix() {
		return c.Status(fiber.StatusForbidden).JSON(fiber.Map{
			"error": "You have been banned",
			"reason": banRecord.Reason,
			"timestamp": banRecord.Timestamp,
		})
	}

	if err := db.DB.Delete(&banRecord).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to unban user",
		})
	}

	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"message": "User ban expired",
	})
}