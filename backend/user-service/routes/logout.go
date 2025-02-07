package routes

import (
	"time"

	"github.com/gofiber/fiber/v2"
)

// LogoutHandler handles user logout by clearing the Authorization cookie
func LogoutHandler(c *fiber.Ctx) error {
	// Clear the Authorization cookie
	c.Cookie(&fiber.Cookie{
		Name:     "Authorization",                // Cookie name to clear
		Value:    "",                             // Empty value to remove the cookie
		Expires:  time.Now().Add(-1 * time.Hour), // Set an expired time to delete
		HTTPOnly: true,
		Secure:   true,     // Make sure the cookie is cleared securely
		SameSite: "Strict", // Match the SameSite attribute used during login
	})

	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"message": "Logout successful",
	})
}
