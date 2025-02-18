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
	var community models.Community
	if err := db.DB.First(&community, commuID).Error; err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "Community not found"})
	}

	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"message": "Success",
		"community": community,
	})
}
