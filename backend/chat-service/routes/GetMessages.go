package routes

import (
    "github.com/gofiber/fiber/v2"
    "chat-service/db"
    "chat-service/models"
)

func GetMessages(c *fiber.Ctx) error 
    roomID := c.Params("room_id")
    limit := 50
    offset := c.Query("offset", "0")

    var messages []models.Message
    err := db.DB.
        Where("room_id = ?", roomID).
        Order("timestamp DESC").
        Limit(limit).
        Offset(offset).
        Find(&messages).Error
    
    if err != nil {
        return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
            "error": "Failed to fetch messages",
        })
    }

    return c.Status(fiber.StatusCreated).JSON(fiber.Map{
		"message": "Get message success",
		"data": messages,
	})
}
