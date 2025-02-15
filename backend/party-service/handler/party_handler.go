package handler

import (
    "party-service/repository"
    "github.com/gofiber/fiber/v2"
    "github.com/google/uuid"
)

type FindPartyRequest struct {
    UserID uuid.UUID `json:"user_id"`
}

func FindPartyHandler(c *fiber.Ctx) error {
    req := new(FindPartyRequest)
    if err := c.BodyParser(req); err != nil {
        return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
            "error": "Invalid request",
        })
    }

    party, err := repository.FindAvailableParty()
    if err != nil {
        party, err = repository.CreateParty(5)
        if err != nil {
            return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
                "error": "Failed to create new party",
            })
        }
    }

    if err := repository.JoinParty(party.ID, req.UserID); err != nil {
        return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
            "error": "Failed to join party",
        })
    }

    return c.Status(fiber.StatusOK).JSON(fiber.Map{
        "party_id": party.ID,
        "current_members": len(party.Members) + 1,
        "max_slots": party.MaxSlots,
    })
}