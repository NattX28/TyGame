package public

import (
	"user-service/db"
	"user-service/models"

	"github.com/gofiber/fiber/v2"
)

// GetProfileHandler retrieves the user's profile information
func GetProfileHandler(c *fiber.Ctx) error {
	var user models.User
	if err := db.DB.First(&user, "id = ?", userID).Error; err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "User not found"})
	}

	// Return user profile data
	return c.JSON(fiber.Map{
		"name":        user.Name,
		"username":    user.Username,
		"description": user.Description,
	})
}
