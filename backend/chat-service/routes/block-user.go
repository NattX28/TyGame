package routes

import (
	// "log"
	// "net/http"

	"github.com/gofiber/fiber/v2"
	// "github.com/gofiber/websocket/v2"
	// "github.com/google/uuid"
	// "github.com/gorilla/websocket"
)

func BlockUser(c *fiber.Ctx) error {
	return c.Status(fiber.StatusCreated).JSON(fiber.Map{
		"message": "Block successfully",
	})
}