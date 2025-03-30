package public

import (
	"user-service/db"
	"user-service/models"

	"github.com/gofiber/fiber/v2"
)


func GetUsersDataHandler(c *fiber.Ctx) error {
	var requestBody struct {
		UserIDs []string `json:"userIds"`
	}

	if err := c.BodyParser(&requestBody); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid request body",
		})
	}

	var users []models.UserResForUser
	query := `
		SELECT id, name, username, description
		FROM users
		WHERE id IN ?
	`
	if err := db.DB.Raw(query, requestBody.UserIDs).Scan(&users).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to fetch users",
		})
	}

	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"message": "Fetch users data successfully",
		"users":   users,
	})
}
