package usersmanagement

import (
	"fmt"
	"os"
	"user-service/db"
	"user-service/models"

	"github.com/gofiber/fiber/v2"
	"github.com/golang-jwt/jwt/v5"
	"github.com/google/uuid"
	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"
)

func UpdateUserHandler(c *fiber.Ctx) error {
	tokenString := c.Cookies("Authorization")
	if tokenString == "" {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
			"error": "Missing token",
		})
	}

	// Remove "Bearer " prefix
	if len(tokenString) > 7 && tokenString[:7] == "Bearer " {
		tokenString = tokenString[7:]
	}

	fmt.Println("Received Token:", tokenString) // Debugging: Print token

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

	userIDStr, ok := claims["user_id"].(string)
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

	// Parse request body
	type UpdateRequest struct {
		Name     string `json:"name"`
		Password string `json:"password"`
	}

	var req UpdateRequest
	if err := c.BodyParser(&req); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid request payload",
		})
	}

	// Fetch user from the database
	var user models.User
	result := db.DB.First(&user, "id = ?", userID)
	if result.Error != nil {
		if result.Error == gorm.ErrRecordNotFound {
			return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
				"error": "User not found",
			})
		}
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Database error",
		})
	}

	// Update fields if provided
	if req.Name != "" {
		user.Name = req.Name
	}

	if req.Password != "" {
		hashedPassword, err := bcrypt.GenerateFromPassword([]byte(req.Password), bcrypt.DefaultCost)
		if err != nil {
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
				"error": "Failed to hash password",
			})
		}
		user.Password = string(hashedPassword)
	}

	// Save the updated user
	if err := db.DB.Save(&user).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to update user",
		})
	}

	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"message": "User updated successfully",
		"user": fiber.Map{
			"id":   user.ID,
			"name": user.Name,
		},
	})
}
