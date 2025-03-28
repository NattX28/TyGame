package friendmanagement

import (
	"user-service/db"
	"user-service/models"

	"github.com/gofiber/fiber/v2"
	"github.com/google/uuid"
)

func CheckFriendsHandler(c *fiber.Ctx) error {
	friendID, err := uuid.Parse(c.Params("userID"))
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid user ID",
		})
	}

	userID, err2 := uuid.Parse(c.Locals("UserID").(string))
	if err2 != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to get userID",
		})
	}

	var friend models.Friend
	result := db.DB.Where(
		"(user_id = ? AND friend_id = ?) OR (user_id = ? AND friend_id = ?)",
		userID, friendID, friendID, userID,
	).First(&friend)

	isFriend := result.RowsAffected > 0

	return c.JSON(fiber.Map{
		"message":  "Friends status checked successfully",
		"isFriend": isFriend,
	})
}
