package main

import (
	"log"
	"os"
	
	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/gofiber/fiber/v2/middleware/proxy"
)

func main() {
	app := fiber.New(fiber.Config{
		DisableStartupMessage: false,
	})

	// CORS middleware
	app.Use(cors.New(cors.Config{
		AllowOrigins: "http://localhost:3000,https://tygame.vercel.app,https://tygame.up.railway.app",
		AllowHeaders: "Origin, Content-Type, Accept, Authorization",
		AllowMethods: "GET,POST,PUT,DELETE",
		AllowCredentials: true,
	}))

	// กำหนดค่า URL ของ Services จาก ENV หรือใช้ค่า Default (บน Railway)
	userServiceURL := os.Getenv("USER_SERVICE_URL")
	if userServiceURL == "" {
		userServiceURL = "http://localhost:5001"
	}

	postServiceURL := os.Getenv("POST_SERVICE_URL")
	if postServiceURL == "" {
		postServiceURL = "http://localhost:5002"
	}

	chatServiceURL := os.Getenv("CHAT_SERVICE_URL")
	if chatServiceURL == "" {
		chatServiceURL = "http://localhost:5003"
	}

	communityServiceURL := os.Getenv("COMMUNITY_SERVICE_URL")
	if communityServiceURL == "" {
		communityServiceURL = "http://localhost:5004"
	}

	partyServiceURL := os.Getenv("PARTY_SERVICE_URL")
	if partyServiceURL == "" {
		partyServiceURL = "http://localhost:5005"
	}

	log.Printf("🔗 User Service URL: %s", userServiceURL)
	log.Printf("🔗 Post Service URL: %s", postServiceURL)
	log.Printf("🔗 Chat Service URL: %s", chatServiceURL)
	log.Printf("🔗 Community Service URL: %s", communityServiceURL)
	log.Printf("🔗 Party Service URL: %s", partyServiceURL)

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

	// เหลือ chat service ไว้วางตรงนี้ได้เลย
	app.All("/chat/*", func(c *fiber.Ctx) error {
		url := chatServiceURL + c.OriginalURL()
		log.Printf("➡️ Forwarding to Chat Service: %s", url)
		if err := proxy.Do(c, url); err != nil {
			log.Printf("❌ Chat Service unavailable: %v", err)
			return c.Status(fiber.StatusServiceUnavailable).JSON(fiber.Map{
				"error": "Chat Service unavailable",
			})
		}
		return nil
	})

	// Proxy ไปยัง Community Service
	app.All("/communities/*", func(c *fiber.Ctx) error {
		url := communityServiceURL + c.OriginalURL()
		log.Printf("➡️ Forwarding to Post Service: %s", url)
		if err := proxy.Do(c, url); err != nil {
			log.Printf("❌ Post Service unavailable: %v", err)
			return c.Status(fiber.StatusServiceUnavailable).JSON(fiber.Map{
				"error": "Post Service unavailable",
			})
		}
		return nil
	})

	// Proxy ไปยัง Party Service
	app.All("/party/*", func(c *fiber.Ctx) error {
		url := partyServiceURL + c.OriginalURL()
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
