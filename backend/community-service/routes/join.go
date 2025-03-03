package routes

import (
	"github.com/gofiber/fiber/v2"
	"github.com/google/uuid"

	"community-service/db"
	"community-service/models"
)

func JoinCommunityHandler(c *fiber.Ctx) error {
	commuID, err1 := uuid.Parse(c.Params("CommuID"))
	if err1 != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid Param"})
	}

	// Pull Community
	var community models.Community
	if err := db.DB.First(&community, commuID).Error; err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "Community not found"})
	}

	userID, err := uuid.Parse(c.Locals("UserID").(string))
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to get userID",
		})
	}

	joinReq := models.CommunityMember{
		UserID: 		userID,
		CommunityID: 	commuID,
	}

	if err := db.DB.Create(&joinReq).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to join community"})
	}

	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"message": "Success",
		"community": community,
	})
}
