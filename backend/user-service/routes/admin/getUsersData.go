package admin

import (
	"github.com/gofiber/fiber/v2"

	"user-service/db"
	"user-service/models"
)

func GetUsersDataHandler(c *fiber.Ctx) error {
	var requestBody struct {
		UserIDs []string `json:"userids"`
	}

	if err := c.BodyParser(&requestBody); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid request body",
		})
	}

	var users []models.User
	if err := db.DB.Where("id IN ?", requestBody.UserIDs).Find(&users).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to fetch users",
		})
	}

	var allUsers []models.AllUserData
	for _, user := range users {
		var ban models.Ban
		var banned bool
		var reason *string
		var timestamp *int64

		if err := db.DB.Where("user_id = ?", user.ID).First(&ban).Error; err == nil {
			banned = true
			reason = &ban.Reason
			timestamp = &ban.Timestamp
		} else {
			banned = false
			reason = nil
			timestamp = nil
		}

		allUsers = append(allUsers, models.AllUserData{
			ID:          user.ID.String(),
			Name:        user.Name,
			Username:    user.Username,
			Role:        &user.Role,
			Description: &user.Description,
			Banned:      &banned,
			Reason:      reason,
			Timestamp:   timestamp,
		})
	}
	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"message": "Fetch user data successfully",
		"users":    allUsers,
	})
}