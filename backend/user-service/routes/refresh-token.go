package routes

import (
	"os"
	"time"

	"user-service/db"
	"user-service/models"

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
		// Ensure that the token uses the expected signing method
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

	// Extract claims (user data) from the old token
	claims, ok := token.Claims.(jwt.MapClaims)
	if !ok {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
			"error": "Failed to parse token claims",
		})
	}

	// Fetch user from the database using user_id in claims
	var user models.User
	result := db.DB.First(&user, "id = ?", claims["user_id"])
	if result.Error != nil {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
			"error": "User not found",
		})
	}

	// Create new claims with updated expiration and cookie_version
	newClaims := jwt.MapClaims{
		"user_id":        claims["user_id"],
		"username":       claims["username"],
		"email":          claims["email"],
		"role":           claims["role"],
		"name":           claims["name"],
		"imagename":      claims["imagename"],
		"cookie_version": user.CookieVersion, // Use the current cookie_version from the database
		"exp":            time.Now().Add(24 * time.Hour).Unix(),
	}

	// Create a new token with the updated claims
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
