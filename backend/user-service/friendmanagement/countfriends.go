package friendmanagement

import (
    "user-service/db"

    "github.com/gofiber/fiber/v2"
    "github.com/google/uuid"
)

func CountFriendsHandler(c *fiber.Ctx) error {
	userID, err := uuid.Parse(c.Params("userID"))
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid user ID",
		})
	}

    var friendCount int64

    query := `
			SELECT COUNT(*)
			FROM (
				SELECT f.friend_id
				FROM friends f
				WHERE f.user_id = ?
				UNION
				SELECT f.user_id
				FROM friends f
				WHERE f.friend_id = ?
			) AS friend_union
    `

    if err := db.DB.Raw(query, userID, userID).Scan(&friendCount).Error; err != nil {
        return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Could not count friends"})
    }

    return c.JSON(fiber.Map{
        "message": "Friend count retrieved successfully",
        "count":   friendCount,
    })
}