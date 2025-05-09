package routes

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

	err = db.DB.Raw(`
    SELECT r.room_id, r.is_group, 
      CASE 
        WHEN NOT r.is_group THEN other_rm.user_id
        ELSE r.name
      END AS room_name,
      COALESCE(m.content, NULL) AS last_msg, COALESCE(m.timestamp, NULL) AS timestamp
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
    LEFT JOIN room_members other_rm ON r.room_id = other_rm.room_id AND other_rm.user_id != ?
    WHERE rm.user_id = ?
    ORDER BY COALESCE(m.timestamp, 0) DESC
    LIMIT ?;
	`, userID, userID, limit).Scan(&rooms).Error

	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"message": "Get rooms data fail",
		})
	}

	return c.Status(fiber.StatusCreated).JSON(fiber.Map{
		"rooms": rooms,
		"message": "Get rooms data success",
	})
}