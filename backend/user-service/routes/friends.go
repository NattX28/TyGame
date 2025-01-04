package routes

import (
	"context"
	"user-service/db"

	"github.com/gofiber/fiber/v2"
)

func GetFriendsHandler(c *fiber.Ctx) error {
	userID := c.Query("user_id")
	if userID == "" {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "User ID is required",
		})
	}

	// Fetch friends from the database
	rows, err := db.DB.Query(context.Background(), `
		SELECT friend_id FROM friendships WHERE user_id = $1
	`, userID)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to fetch friends",
		})
	}
	defer rows.Close()

	// Parse results
	var friends []string
	for rows.Next() {
		var friendID string
		if err := rows.Scan(&friendID); err != nil {
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
				"error": "Failed to parse friends",
			})
		}
		friends = append(friends, friendID)
	}

	// Return friends
	return c.JSON(fiber.Map{
		"friends": friends,
	})
}
