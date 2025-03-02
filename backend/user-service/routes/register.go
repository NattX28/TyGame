package routes

import (
	"errors"
	"user-service/db"
	"user-service/models"

	"github.com/gofiber/fiber/v2"
	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"
)

func RegisterHandler(c *fiber.Ctx) error {
	type RegisterRequest struct {
		Username string `json:"username"`
		Email    string `json:"email"`
		Password string `json:"password"`
	}

	var req RegisterRequest
	if err := c.BodyParser(&req); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid request payload",
		})
	}

	// Validate required fields
	if req.Username == "" || req.Email == "" || req.Password == "" {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "All fields are required",
		})
	}

	// Check if email already exists
	var existingUser models.User
	err := db.DB.Where("email = ?", req.Email).First(&existingUser).Error
	if err == nil {
		return c.Status(fiber.StatusConflict).JSON(fiber.Map{
			"error": "Email already in use",
		})
	} else if !errors.Is(err, gorm.ErrRecordNotFound) {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to query database",
		})
	}

	// Hash password
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(req.Password), bcrypt.DefaultCost)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to hash password",
		})
	}

	// Create new user
	newUser := models.User{
		Username: req.Username,
		Email:    req.Email,
		Password: string(hashedPassword),
		Role:     "User",
		Name:     req.Username,
	}

	if err := db.DB.Create(&newUser).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to create user",
		})
	}

	return c.Status(fiber.StatusCreated).JSON(fiber.Map{
		"message": "User registered successfully",
		"user_id": newUser.ID,
	})
}
