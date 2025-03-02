package routes

import (
	"github.com/gofiber/fiber/v2"

	"community-service/db"
	"community-service/models"
)

func GetAllCommunities(c *fiber.Ctx) error {
	var communities []models.Community

	if err := db.DB.Find(&communities).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Error fetching communities",
		})
	}

	var response []fiber.Map
	for _, community := range communities {
		response = append(response, fiber.Map{
			"id":          community.ID,
			"name":        community.Name,
			"description": community.Description,
			"image":       community.Image,
		})
	}

	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"message":    "Success",
		"communities": response,
	})
}