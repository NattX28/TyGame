package handler

import (
	"errors"
	"log"
	"party-service/db"
	"party-service/models"
	"party-service/repository"
	"strconv"

	"github.com/gofiber/fiber/v2"
	"github.com/google/uuid"
	"gorm.io/gorm"
)

type FindPartyRequest struct {
	UserID uuid.UUID `json:"user_id"`
}

func IsUserInAnyParty(userID uuid.UUID) bool {
	var partymember models.PartyMember
	if err := db.DB.Where("user_id = ?", userID).First(&partymember).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			log.Printf("User %s is not in any party", userID) // Add this log
		}
		return false
	}

	return true
}

func FindPartyHandler(c *fiber.Ctx) error {
    maxSlots, err := strconv.Atoi(c.Query("max_slots"))
    if err != nil {
        return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
            "error": "Invalid max slot. Should be number. ",
        })
    }

    if maxSlots < 2 || maxSlots > 10 {
        return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
            "error": "There must be more than 2 and a maximum of 10 users. ",
        })
    }
    
    userID, err := uuid.Parse(c.Locals("UserID").(string))
    if err != nil {
        return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
            "error": "Failed to get userID",
        })
    }
    
    // ดึง community ID จาก request
    communityID, err := uuid.Parse(c.Params("community_id"))
    if err != nil {
        return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
            "error": "Invalid community ID",
        })
    }
    
    // check ว่า user อยู่ห้องอื่นหรือยัง ถ้าอยู่ห้ามไป join ห้องอื่น
    isInAnyParty := IsUserInAnyParty(userID)
    if isInAnyParty {
        return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
            "error": "User is already in another party",
        })
    }

    // เริ่มหาห้อง - ส่ง communityID ไปด้วย
    party, err := repository.FindAvailableParty(maxSlots, communityID)
    
    // ถ้าไม่เจอห้องที่ว่าง (party == nil) หรือมี error
    if err != nil || party == nil {
        // สร้างห้องใหม่ พร้อมกับ communityID
        party, err = repository.CreateParty(maxSlots, communityID)
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
        "party_id":        party.ID,
        "current_members": len(party.Members) + 1,
        "max_slots":       party.MaxSlots,
        "community_id":    party.CommunityID,
    })
}

func LeavePartyHandler(c *fiber.Ctx) error {
	userID, err := uuid.Parse(c.Locals("UserID").(string))
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to get userID",
		})
	}

	err = repository.LeaveParty(userID)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": err.Error(),
		})
	}

	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"message": "User left the party successfully",
	})
}
