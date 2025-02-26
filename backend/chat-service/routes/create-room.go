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

	room := models.Room{
		RoomID:   uuid.New(),
		IsGroup:  isGroup,
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
