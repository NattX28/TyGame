package public

import (
	"user-service/db"
	"user-service/models"

	"github.com/gofiber/fiber/v2"
	"github.com/google/uuid"
)

func GetUserDataHandler(c *fiber.Ctx) error {
	userID, err := uuid.Parse(c.Params("userID"))
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid user ID"})
	}

	var user models.User
	if err := db.DB.First(&user, "id = ?", userID).Error; err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "User not found"})
	}

	// Return user profile data
	return c.JSON(fiber.Map{
		"id": 				 user.ID,
		"name":        user.Name,
		"username":    user.Username,
		"description": user.Description,
	})
}
