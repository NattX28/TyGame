package middleware

import (
	"fmt"
	"os"

	"github.com/gofiber/fiber/v2"
	"github.com/golang-jwt/jwt/v5"
)

// JWTMiddleware checks the JWT token from the Authorization header or cookie
// JWTMiddleware checks the JWT token from the Authorization header or cookie
func JWTMiddleware(c *fiber.Ctx) error {

	tokenString := c.Get("Authorization")
	fmt.Println("Token from Header:", tokenString) // Debugging

	if tokenString == "" {
		tokenString = c.Cookies("Authorization")
		fmt.Println("Token from Cookie:", tokenString) // Debugging
	}

	if tokenString == "" {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
			"error": "Missing token",
		})
	}

	// ✅ Remove "Bearer " prefix if it exists
	if len(tokenString) > 7 && tokenString[:7] == "Bearer " {
		tokenString = tokenString[7:]
	}

	fmt.Println("Final Token Used:", tokenString) // Debugging

	// Parse the token
	secret := os.Getenv("JWT_SECRET")
	token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
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

	return c.Next()
}
