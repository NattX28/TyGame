package routes

import (
	"github.com/gofiber/fiber/v2"
	"github.com/google/uuid"

	"community-service/db"
	"community-service/models"
)

func GetCommunityHandler(c *fiber.Ctx) error {
	commuID, err1 := uuid.Parse(c.Params("CommuID"))
	if err1 != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid Param"})
	}

	// Pull Community
	var communityRes models.CommunityResponse
	query := `
			SELECT id, name, description, category, image
			FROM communities
			WHERE id = ?
	`
	if err := db.DB.Raw(query, commuID).Scan(&communityRes).Error; err != nil {
			return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "Community not found"})
	}

	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"message": "Success",
		"community": communityRes,
	})
}
