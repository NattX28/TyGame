package friendmanagement

import (
	"user-service/db"
	"user-service/models"

	"github.com/gofiber/fiber/v2"
	"github.com/google/uuid"
)

func GetFriendsHandler(c *fiber.Ctx) error {
	userID, err := uuid.Parse(c.Locals("UserID").(string))
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to get userID",
		})
	}

	var FriendResponse []models.FriendResponse

	query := `
		SELECT u.id AS friend_id, u.name, u.username
		FROM friends f
		JOIN users u ON u.id = f.friend_id 
		WHERE f.user_id = ?
		UNION
		SELECT u.id AS friend_id, u.name, u.username
		FROM friends f
		JOIN users u ON u.id = f.user_id 
		WHERE f.friend_id = ?
	`

	if err := db.DB.Raw(query, userID, userID).Scan(&FriendResponse).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Could not retrieve friends"})
	}

	if FriendResponse == nil {
		FriendResponse = []models.FriendResponse{}
	}
	return c.JSON(fiber.Map{
		"message": "Friends retrieved successfully",
		"friends": FriendResponse,
	})
}
