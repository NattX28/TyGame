package routes

import (
    "strconv"
    "github.com/gofiber/fiber/v2"
    "chat-service/db"
    "chat-service/models"
)

func GetMessages(c *fiber.Ctx) error {
    roomID := c.Params("room_id")
    limit := 50
    offsetStr := c.Query("offset", "0")

    offset, err := strconv.Atoi(offsetStr)
    if err != nil {
        return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
            "error": "Invalid offset value",
        })
    }

    var messages []models.Message
    
    if err := db.DB.
        Where("room_id = ?", roomID).
        Order("timestamp DESC").
        Limit(limit).
        Offset(offset).
        Find(&messages).Error; err != nil {
        return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
            "error": "Failed to fetch messages",
        })
    }

    return c.Status(fiber.StatusCreated).JSON(fiber.Map{
		"message": "Get message success",
		"data": messages,
	})
}
