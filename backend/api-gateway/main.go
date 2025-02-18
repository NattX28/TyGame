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

	// กำหนดค่า URL ของ Services จาก ENV หรือใช้ค่า Default (บน Railway)
	userServiceURL := os.Getenv("USER_SERVICE_URL")
	if userServiceURL == "" {
		userServiceURL = "https://user-service.up.railway.app" // แก้ให้ตรงกับ Railway ของคุณ
	}

	postServiceURL := os.Getenv("POST_SERVICE_URL")
	if postServiceURL == "" {
		postServiceURL = "https://post-service.up.railway.app" // แก้ให้ตรงกับ Railway ของคุณ
	}

	log.Printf("🔗 User Service URL: %s", userServiceURL)
	log.Printf("🔗 Post Service URL: %s", postServiceURL)

	// Proxy ไปยัง User Service
	app.All("/users/*", func(c *fiber.Ctx) error {
		url := userServiceURL + c.OriginalURL()
		log.Printf("➡️ Forwarding to User Service: %s", url)
		if err := proxy.Do(c, url); err != nil {
			log.Printf("❌ User Service unavailable: %v", err)
			return c.Status(fiber.StatusServiceUnavailable).JSON(fiber.Map{
				"error": "User Service unavailable",
			})
		}
		return nil
	})

	// Proxy ไปยัง Post Service
	app.All("/posts/*", func(c *fiber.Ctx) error {
		url := postServiceURL + c.OriginalURL()
		log.Printf("➡️ Forwarding to Post Service: %s", url)
		if err := proxy.Do(c, url); err != nil {
			log.Printf("❌ Post Service unavailable: %v", err)
			return c.Status(fiber.StatusServiceUnavailable).JSON(fiber.Map{
				"error": "Post Service unavailable",
			})
		}
		return nil
	})

	// Route Default (404)
	app.Use(func(c *fiber.Ctx) error {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"error": "Route not found",
		})
	})

	// ใช้ PORT จาก ENV หรือ Default เป็น 8080
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	log.Printf("🚀 API Gateway started on port %s", port)
	log.Fatal(app.Listen(":" + port))
}
