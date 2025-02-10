package middleware

import (
	"github.com/gofiber/fiber/v2"
)

func CanManagement(c *fiber.Ctx) error {
	Role := c.Locals("Role").(string)
	if Role == "Admin" || Role == "Super Admin" {
		return c.Next()
	}

	return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
		"error": "You are not allowed to perform this action",
	})
}

func CanAccess(c *fiber.Ctx) error {
	Role := c.Locals("Role").(string)
	if Role == "Admin" || Role == "Super Admin" || Role == "User" {
		return c.Next()
	}

	return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
		"error": "You are not allowed to perform this action",
	})
}