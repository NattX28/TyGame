package routes

import (
	"github.com/gofiber/fiber/v2"
	"github.com/google/uuid"
	"community-service/db"
	"community-service/models"
)

func GetMemberCommunityHandler(c *fiber.Ctx) error {
	commuID, err := uuid.Parse(c.Params("CommuID"))
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid community ID"})
	}

	// Check if the community exists
	var community models.Community
	if err := db.DB.First(&community, "id = ?", commuID).Error; err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "Community not found"})
	}

	// Fetch only UserIDs of members in this community
	var userIDs []uuid.UUID
	if err := db.DB.
		Model(&models.CommunityMember{}).
		Where("community_id = ?", commuID).
		Pluck("user_id", &userIDs).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to fetch community members"})
	}

	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"message":  "Success",
		"userIds": userIDs,
	})
}
