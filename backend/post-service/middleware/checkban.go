package middleware

import (
	"net/http"
	"fmt"
	"io/ioutil"
	"os"
	"github.com/gofiber/fiber/v2"
)

func CheckUseBanned(c *fiber.Ctx) error {
	userID := c.Locals("UserID").(string)
	baseURL := os.Getenv("USER_SERVICE_URL")
	apiURL := fmt.Sprintf("%s/users/%s/checkban", baseURL, userID)

	resp, err := http.Get(apiURL)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to call CheckUseBanned API",
		})
	}
	defer resp.Body.Close()

	if resp.StatusCode == 200 {
		return c.Next()
	}

	body, _ := ioutil.ReadAll(resp.Body)
	return c.Status(resp.StatusCode).SendString(string(body)) // Return status code and response body
}