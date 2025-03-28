package friendmanagement

import (
	"os"
	"user-service/db"
	"user-service/models"

	"github.com/gofiber/fiber/v2"
	"github.com/golang-jwt/jwt/v5"
	"github.com/google/uuid"
)

// AddFriendHandler ensures a friend cannot be added twice
func AddFriendHandler(c *fiber.Ctx) error {
	// Get the JWT token from the cookie
	tokenString := c.Cookies("Authorization")
	if tokenString == "" {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
			"error": "Missing token",
		})
	}

	// Remove "Bearer " prefix if exists
	if len(tokenString) > 7 && tokenString[:7] == "Bearer " {
		tokenString = tokenString[7:]
	}

	// Parse the token
	secret := os.Getenv("JWT_SECRET")
	token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, fiber.ErrUnauthorized
		}
		return []byte(secret), nil
	})

	if err != nil || !token.Valid {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
			"error": "Invalid or expired token",
		})
	}

	claims, ok := token.Claims.(jwt.MapClaims)
	if !ok {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
			"error": "Invalid token claims",
		})
	}

	userIDStr, ok := claims["userid"].(string)
	if !ok {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
			"error": "Invalid user ID format",
		})
	}

	// Convert userID from string to UUID
	userID, err := uuid.Parse(userIDStr)
	if err != nil {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
			"error": "Invalid UUID format",
		})
	}

	// Parse friend_id from the request
	type FriendRequest struct {
    FriendID string `json:"userId"`
	}

	var friend FriendRequest
	if err := c.BodyParser(&friend); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid request body"})
	}
	friendUUID, err := uuid.Parse(friend.FriendID)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid post ID"})
	}

	// Check if the friendship already exists
	var existingFriendship models.Friend
	result := db.DB.Where("(user_id = ? AND friend_id = ?) OR (user_id = ? AND friend_id = ?)", userID, friend.FriendID, friend.FriendID, userID).First(&existingFriendship)
	if result.RowsAffected > 0 {
		return c.Status(fiber.StatusConflict).JSON(fiber.Map{"error": "Already friends"})
	}

	// Create the friendship in the database
	friendship := models.Friend{UserID: userID, FriendID: friendUUID}
	err = db.DB.Create(&friendship).Error
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Could not add friend"})
	}

	return c.JSON(fiber.Map{"message": "Friend added successfully"})
}
