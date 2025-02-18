package main

import (
	"log"
	"github.com/gofiber/fiber/v2"
)

func main() {
	app := fiber.New()

	// Forward request ไปที่ User Service
	app.All("/users/*", func(c *fiber.Ctx) error {
		return c.Redirect("http://user-service:5001" + c.OriginalURL(), fiber.StatusTemporaryRedirect)
	})

	// Forward request ไปที่ Post Service
	app.All("/posts/*", func(c *fiber.Ctx) error {
		return c.Redirect("http://post-service:5002" + c.OriginalURL(), fiber.StatusTemporaryRedirect)
	})

	log.Fatal(app.Listen(":8080"))
}
