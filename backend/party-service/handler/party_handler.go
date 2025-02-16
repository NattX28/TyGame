package handler

import (
	"party-service/db"
	"party-service/models"
	"party-service/repository"
	"strconv"

	"github.com/gofiber/fiber/v2"
	"github.com/google/uuid"
)

type FindPartyRequest struct {
    UserID uuid.UUID `json:"user_id"`
}

func IsUserInAnyParty(userID uuid.UUID) (bool) {
    var partymember models.PartyMember
    if err := db.DB.Where("user_id = ?", userID).First(&partymember).Error; err != nil {
        return false
    }
    
    return true
}

func FindPartyHandler(c *fiber.Ctx) error {
    maxSlots,err := strconv.Atoi(c.Query("max_slots"))
    userID, err := uuid.Parse(c.Locals("UserID").(string))
    if err != nil {
        return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
            "error": "Failed to get userID",
    })
}
    // check ว่า user อยู่ห้องอื่นหรือยัง ถ้าอยู่ห้ามไป join ห้องอื่น
    isInAnyParty := IsUserInAnyParty(userID)
    if isInAnyParty {
        return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
            "error": "User is already in another party",
        })
    }

    // เริ่มหาห้อง
    party, err := repository.FindAvailableParty(maxSlots)
    // ถ้าไม่เจอห้องที่ว่าง (party == nil) หรือมี error
    if err != nil || party == nil {
        // สร้างห้องใหม่
        party, err = repository.CreateParty(maxSlots)
        if err != nil {
            return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
                "error": "Failed to create new party",
            })
        }
    }

    if err := repository.JoinParty(party.ID, userID); err != nil {
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