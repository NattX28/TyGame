package routes

import (
	"os"
	"time"

	"github.com/gofiber/fiber/v2"
	"github.com/golang-jwt/jwt/v5"
)

// RefreshTokenHandler generates a new token if the old one is valid
func RefreshTokenHandler(c *fiber.Ctx) error {
	// Get token from cookies
	tokenString := c.Cookies("Authorization")

	if tokenString == "" {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
			"error": "Token is missing",
		})
	}

	// Remove "Bearer " prefix if present
	if len(tokenString) > 7 && tokenString[:7] == "Bearer " {
		tokenString = tokenString[7:]
	}

	// Parse and validate the token
	secret := os.Getenv("JWT_SECRET")
	token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
		return []byte(secret), nil
	})

	if err != nil || !token.Valid {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
			"error": "Invalid or expired token",
		})
	}

	// Extract claims (user data)
	claims, ok := token.Claims.(jwt.MapClaims)
	if !ok {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
			"error": "Failed to parse token claims",
		})
	}

	// Create a new token with the same user ID and email
	newClaims := jwt.MapClaims{
		"user_id":  claims["user_id"],
		"username": claims["username"],
		"email":    claims["email"],
		"exp":      time.Now().Add(24 * time.Hour).Unix(),
	}

	newToken := jwt.NewWithClaims(jwt.SigningMethodHS256, newClaims)
	newTokenString, err := newToken.SignedString([]byte(secret))
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to generate new token",
		})
	}

	// Set the new token as a cookie
	c.Cookie(&fiber.Cookie{
		Name:     "Authorization",
		Value:    "Bearer " + newTokenString,
		Expires:  time.Now().Add(24 * time.Hour),
		HTTPOnly: true,
		Secure:   true,
		SameSite: "Lax",
	})

	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"message": "Token refreshed successfully",
		"token":   newTokenString,
	})
}
