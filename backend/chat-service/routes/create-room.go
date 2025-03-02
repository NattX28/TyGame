package routes

import (
	"github.com/google/uuid"
	"github.com/gofiber/fiber/v2"

	"chat-service/models"
	"chat-service/db"
)

func CreateRoom(c *fiber.Ctx) error {
	var req models.ReqCreateRoom
	if err := c.BodyParser(&req); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid request"})
	}

	userID, err := uuid.Parse(c.Locals("UserID").(string))
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to get userID",
		})
	}

	// Ensure userID is in req.UserIDs
	isUserIncluded := false
	for _, id := range req.UserIDs {
		if id == userID {
			isUserIncluded = true
			break
		}
	}
	if !isUserIncluded {
		req.UserIDs = append(req.UserIDs, userID)
	}

	nMember := len(req.UserIDs)
	if nMember <= 1 || nMember > 20 {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Member UserID Invalid"})
	}
	isGroup := nMember > 2

	// Direct Message Room Check (1-1 Chat)
	if !isGroup && nMember == 2 {
		var existingRoom models.Room

		err = db.DB.Raw(`
			SELECT r.*
			FROM rooms r
			JOIN room_members rm1 ON r.room_id = rm1.room_id
			JOIN room_members rm2 ON r.room_id = rm2.room_id
			WHERE r.is_group = false
			AND ((rm1.user_id = ? AND rm2.user_id = ?) OR (rm1.user_id = ? AND rm2.user_id = ?))
			GROUP BY r.room_id
			HAVING COUNT(rm1.room_id) = 2
		`, req.UserIDs[0], req.UserIDs[1], req.UserIDs[1], req.UserIDs[0]).First(&existingRoom).Error

		if err == nil {
			return c.Status(fiber.StatusOK).JSON(fiber.Map{
				"room_id": existingRoom.RoomID,
				"message": "Direct message room already exists",
			})
		}
	} else if isGroup {
		// Optional: Check if a group with exactly these members already exists (like your original query)
		var existingRoom models.Room
		err = db.DB.
			Joins("JOIN room_members ON rooms.room_id = room_members.room_id").
			Where("rooms.is_group = ? AND room_members.user_id IN (?)", isGroup, req.UserIDs).
			Group("rooms.room_id").
			Having("COUNT(room_members.user_id) = ?", nMember).
			First(&existingRoom).Error

		if err == nil {
			return c.Status(fiber.StatusOK).JSON(fiber.Map{
				"room_id": existingRoom.RoomID,
				"message": "Group room already exists",
			})
		}

		// Require name for group chats
		if req.Name == nil || *req.Name == "" {
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
				"error": "Group name is required for group chats",
			})
		}
	}

	room := models.Room{
		RoomID:  uuid.New(),
		IsGroup: isGroup,
	}

	if isGroup && req.Name != nil {
		room.Name = *req.Name
	}

	if err := db.DB.Create(&room).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to create room"})
	}

	var members []models.RoomMember
	for _, uid := range req.UserIDs {
		members = append(members, models.RoomMember{
			RoomID: room.RoomID,
			UserID: uid,
		})
	}

	if err := db.DB.Create(&members).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to add members"})
	}

	return c.Status(fiber.StatusCreated).JSON(fiber.Map{
		"room_id": room.RoomID,
		"message": "Room created successfully",
	})
}
