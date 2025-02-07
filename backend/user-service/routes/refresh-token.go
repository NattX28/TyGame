package routes

import (
	"time"

	"github.com/gofiber/fiber/v2"
)

// RefreshTokenHandler handles clearing all cookies (logging out the user)
func RefreshTokenHandler(c *fiber.Ctx) error {
	// Remove the Authorization cookie by setting an expired time in the past
	c.Cookie(&fiber.Cookie{
		Name:     "Authorization",                // Cookie name to clear
		Value:    "",                             // Empty value to remove the cookie
		Expires:  time.Now().Add(-1 * time.Hour), // Set an expired time to delete
		HTTPOnly: true,
		Secure:   true,     // Secure the cookie removal
		SameSite: "Strict", // SameSite attribute as used during login
	})

	// Optionally remove other cookies by repeating the process:
	// c.Cookie(&fiber.Cookie{...})

	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"message": "All cookies cleared, user logged out successfully",
	})
}
