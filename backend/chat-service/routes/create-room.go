package handler

import (
	"github.com/google/uuid"
	
	"chat-service/models"
)

func CreateRoom(c *fiber.Ctx) error {
	if err := c.BodyParser(&req); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid request"})
	}

	nMember := len(req.UserIDs)
	if nMember <= 1 {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "At least one user is required"})
	}
	isGroup := nMember > 2

	var existingRoom models.Room
	err = database.DB.
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
		IsGroup:  IsGroup,
	}

	if err := database.DB.Create(&room).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to create room"})
	}

	var members []models.RoomMember
	for _, userID := range req.UserIDs {
		members = append(members, models.RoomMember{
			RoomID: roomID,
			UserID: userID,
		})
	}

	if err := database.DB.Create(&members).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to add members"})
	}

	return c.Status(fiber.StatusCreated).JSON(fiber.Map{
		"room_id": roomID,
		"message": "Room created successfully",
	})
}
