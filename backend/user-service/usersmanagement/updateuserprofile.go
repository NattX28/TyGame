package usersmanagement

import (
	"fmt"
	"os"
	"path/filepath"
	"strings"
	"time"
	"user-service/db"
	"user-service/models"

	"github.com/gofiber/fiber/v2"
	"github.com/golang-jwt/jwt/v5"
	"github.com/google/uuid"
)

// UploadProfileHandler handles profile image uploads
func UploadProfileHandler(c *fiber.Ctx) error {
	// Get JWT token from cookies
	tokenString := c.Cookies("Authorization")
	if tokenString == "" {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{"error": "Missing token"})
	}

	// Remove "Bearer " prefix if it exists
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
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{"error": "Invalid or expired token"})
	}

	// Extract user ID from token
	claims, ok := token.Claims.(jwt.MapClaims)
	if !ok {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{"error": "Invalid token claims"})
	}

	userIDStr, ok := claims["userid"].(string)
	if !ok {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{"error": "Invalid user ID format"})
	}

	userID, err := uuid.Parse(userIDStr)
	if err != nil {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{"error": "Invalid UUID format"})
	}

	// Get uploaded file
	file, err := c.FormFile("image")
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Image file is required"})
	}

	// Validate file type
	allowedTypes := map[string]bool{
		"image/jpeg": true,
		"image/png":  true,
		"image/gif":  true,
	}

	contentType := file.Header.Get("Content-Type")
	if !allowedTypes[contentType] {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid file type. Allowed: JPEG, PNG, GIF"})
	}

	// Check File Size (Max 5MB)
	const maxSize = 5 * 1024 * 1024 // 5MB
	if file.Size > maxSize {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "File size exceeds 5MB limit"})
	}

	// Generate unique filename
	extension := strings.ToLower(filepath.Ext(file.Filename))
	filename := fmt.Sprintf("%d%s", time.Now().UnixNano(), extension)

	// Define the upload path
	uploadPath := fmt.Sprintf("./uploads/users/%s", filename)

	// Save the file
	if err := c.SaveFile(file, uploadPath); err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to save file"})
	}

	// Update user profile with new image filename
	err = db.DB.Model(&models.User{}).Where("id = ?", userID).Update("image_name", filename).Error
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to update profile image"})
	}

	return c.JSON(fiber.Map{
		"message": "Profile image uploaded successfully",
		"image":   filename,
	})
}
