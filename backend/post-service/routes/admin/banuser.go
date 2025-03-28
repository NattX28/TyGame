package admin

import (
    "time"

    "github.com/gofiber/fiber/v2"
    "github.com/google/uuid"

    "post-service/db"
    "post-service/models"
)


func BanUserHandler(c *fiber.Ctx) error {
	var banReq models.BanUserRequest
	if err := c.BodyParser(&banReq); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid request body",
		})
	}

	var banuser models.BanUser
	if err := db.DB.First(&banuser, banReq.ID).Error; err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"error": "User aready banned",
		})
	}

	if err := db.DB.Create(&banReq).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to ban user",
		})
	}

	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"message": "User banned successfully",
	})
}