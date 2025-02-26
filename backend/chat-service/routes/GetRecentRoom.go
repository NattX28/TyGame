package handler

import (
	"github.com/google/uuid"
	"github.com/gofiber/fiber/v2"

	"chat-service/db"
	"chat-service/models"
)


func GetRecentRoom(c *fiber.Ctx) error {
	limit := 10
	
	var rooms []models.RecentRoom

	userID, err := uuid.Parse(c.Locals("UserID").(string))
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to get userID",
		})
	}

	err := db.Raw(`
		SELECT r.room_id, r.is_group, m.content AS last_msg, m.timestamp
		FROM rooms r
		JOIN room_members rm ON r.room_id = rm.room_id
		LEFT JOIN (
			SELECT room_id, content, timestamp
			FROM messages
			WHERE (room_id, timestamp) IN (
				SELECT room_id, MAX(timestamp)
				FROM messages
				GROUP BY room_id
			)
		) m ON r.room_id = m.room_id
		WHERE rm.user_id = ?
		ORDER BY m.timestamp DESC
		LIMIT ?;
	`, userID, limit).Scan(&rooms).Error

	return c.Status(fiber.StatusCreated).JSON(fiber.Map{
		"rooms": rooms,
		"message": Get rooms data success",
	})
}