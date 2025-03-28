package admin

import (
    "github.com/gofiber/fiber/v2"
		"github.com/google/uuid"

    "user-service/db"
    "user-service/models"
)


func BanUserHandler(c *fiber.Ctx) error {
	var banReq models.BanUserRequest
	if err := c.BodyParser(&banReq); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid request body",
		})
	}

	var existbanuser models.Ban
	if err := db.DB.Where("user_id = ?", banReq.UserID).First(&existbanuser).Error; err == nil {
		return c.Status(fiber.StatusConflict).JSON(fiber.Map{
			"error": "User aready banned",
		})
	}

	userID, err := uuid.Parse(banReq.UserID)
	if err != nil {
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid UserID"})
	}

	banuserform := models.Ban{
		UserID:        userID,
		Reason:    banReq.Reason,
		Timestamp: banReq.Timestamp,
	}
	if err := db.DB.Create(&banuserform).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to ban user",
		})
	}

	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"message": "User banned successfully",
	})
}