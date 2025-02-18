package main

import (
	"log"
	"os"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/proxy"
)

func main() {
	app := fiber.New(fiber.Config{
		DisableStartupMessage: false,
	})

	// ตรวจสอบว่าอยู่ใน production หรือ development
	userServiceURL := os.Getenv("USER_SERVICE_URL")
	if userServiceURL == "" {
		userServiceURL = "http://127.0.0.1:5001"
	}

	postServiceURL := os.Getenv("POST_SERVICE_URL")
	if postServiceURL == "" {
		postServiceURL = "http://127.0.0.1:5002"
	}

	// Forward request ไปที่ User Service ด้วย proxy
	app.All("/users/*", func(c *fiber.Ctx) error {
		path := c.Path()
		url := userServiceURL + path
		log.Printf("Path : %s", url)
		if err := proxy.Do(c, url); err != nil {
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
				"error": "User service unavailable",
			})
		}
		return nil
	})

	// Forward request ไปที่ Post Service ด้วย proxy
	app.All("/posts/*", func(c *fiber.Ctx) error {
		path := c.Path()
		url := postServiceURL + path
		if err := proxy.Do(c, url); err != nil {
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
				"error": "Post service unavailable",
			})
		}
		return nil
	})

	// Default route สำหรับเส้นทางที่ไม่ได้ระบุ
	app.Use(func(c *fiber.Ctx) error {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"error": "Route not found",
		})
	})

	// ตรวจสอบว่ามีการกำหนดพอร์ตจาก environment variable หรือเปล่า
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	log.Printf("API Gateway starting on port %s", port)
	log.Fatal(app.Listen(":" + port))
}