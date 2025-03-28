package admin

import (
	"time"
	"github.com/gofiber/fiber/v2"
	"github.com/google/uuid"

	"user-service/db"
	"user-service/models"
)

func CheckUseBannedUsers(c *fiber.Ctx) error {
	var userIDs []string
	if err := c.BodyParser(&userIDs); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Failed to parse user IDs from body",
		})
	}

	if len(userIDs) == 0 {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "No user IDs provided",
		})
	}

	var banRecords []models.Ban
	if err := db.DB.Where("user_id IN ?", userIDs).Find(&banRecords).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to fetch ban records",
		})
	}

	banMap := make(map[string]models.Ban)
	for _, record := range banRecords {
		banMap[record.UserID.String()] = record
	}

	response := make(map[string]interface{})
	for _, id := range userIDs {
		userID, err := uuid.Parse(id)
		if err != nil {
			response[id] = fiber.Map{
				"banned":  false,
				"message": "Invalid user ID format",
			}
			continue
		}

		banRecord, exists := banMap[userID.String()]
		if !exists {
			response[id] = fiber.Map{
				"banned":  false,
				"message": "User was not banned",
			}
			continue
		}

		if banRecord.Timestamp > time.Now().Unix() {
			response[id] = fiber.Map{
				"banned":   true,
				"message":  "User is currently banned",
				"reason":   banRecord.Reason,
				"timestamp": banRecord.Timestamp,
			}
			continue
		}

		if err := db.DB.Delete(&banRecord).Error; err != nil {
			response[id] = fiber.Map{
				"banned":  true,
				"message": "Failed to unban user",
			}
			continue
		}

		response[id] = fiber.Map{
			"banned":  false,
			"message": "User ban expired",
		}
	}

	return c.Status(fiber.StatusOK).JSON(response)
}