package handler

import (
	"party-service/repository"

	"github.com/gofiber/fiber/v2"
)

type CreatePartyRequest struct {
	PartyID uint `json:"party_id"`
}

func CreatePartyHandler(c *fiber.Ctx) error {
	req := new(CreatePartyRequest)
	if err := c.BodyParser(req); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid request"})
	}

	if err := repository.CreateParty(req.PartyID); err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to create party"})
	}

	return c.Status(fiber.StatusCreated).JSON(fiber.Map{"message": "Party created"})
}
