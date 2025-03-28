package routes

import (
	"time"

	"github.com/gofiber/fiber/v2"
)

func LogoutHandler(c *fiber.Ctx) error {
	// Clear the Authorization cookie
	c.Cookie(&fiber.Cookie{
		Name:     "Authorization",                // Cookie name to clear
		Value:    "",                             // Empty value to remove the cookie
		Expires:  time.Now().Add(-time.Hour), // Set an expired time to delete
		HTTPOnly: true,
		Secure:   true,         // Ensure the cookie is cleared securely
		SameSite: "None",        // Consistent with login cookie
	})
	// c.ClearCookie("Authorization")


	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"message": "Logout successful",
	})
}
