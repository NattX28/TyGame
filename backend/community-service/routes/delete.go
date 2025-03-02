package routes

import (
	"os"
	"fmt"

	"github.com/gofiber/fiber/v2"
	"github.com/google/uuid"

	"community-service/db"
	"community-service/models"
)

func DeleteCommunityHandler(c *fiber.Ctx) error {
	var imagePath = "./uploads/profile/%s"
	commuID, err1 := uuid.Parse(c.Params("CommuID"))
	if err1 != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid Param"})
	}

	// Pull Community
	var community models.Community
	if err := db.DB.First(&community, commuID).Error; err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "Community not found"})
	}

	// Delete Data
	os.Remove(fmt.Sprintf(imagePath, community.Image))

	if err := db.DB.Delete(&community).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to delete community"})
	}
	return c.Status(fiber.StatusOK).JSON(fiber.Map{"message": "Community deleted successfully"})
}
