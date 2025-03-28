package admin

import (
    "time"

    "github.com/gofiber/fiber/v2"
    "github.com/google/uuid"

    "post-service/db"
    "post-service/models"
)

func BanUserHandler(c *fiber.Ctx) error {

	userID, err := uuid.Parse(c.Params("UserID"))
	if err != nil {
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid UserID"})
	}

	banUser := models.BanUser{
		ID:        uuid.New(),
		UserID:    userID,
		Timestamp: time.Now().Unix(),
		CreatedAt: time.Now(),
	}

	if err := db.DB.Create(&banUser).Error; err != nil {
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to ban user"})
	}

	return c.Status(fiber.StatusOK).JSON(fiber.Map{"message": "User banned successfully"})
}