package public

import (
	"strings"
	"path/filepath"

	"github.com/gofiber/fiber/v2"
)

func GetImageHandler(c *fiber.Ctx) error {
	nameFile := c.Params("nameFile")

	if strings.Contains(nameFile, "..") || strings.Contains(nameFile, "/") || strings.Contains(nameFile, "\\") {
		return c.Status(fiber.StatusBadRequest).SendString("Invalid filename")
	}

	filePath := filepath.Join("./uploads/posts/", nameFile)

	allowedExtensions := map[string]bool{
		".jpg":  true,
		".jpeg": true,
		".png":  true,
		".gif":  true,
		".jfif":  true,
	}

	if !allowedExtensions[strings.ToLower(filepath.Ext(nameFile))] {
		return c.Status(fiber.StatusForbidden).SendString("File type not allowed")
	}

	// Serve file (check if file exists)
	if _, err := filepath.Abs(filePath); err != nil {
		return c.Status(fiber.StatusInternalServerError).SendString("Error resolving file path")
	}

	return c.SendFile(filePath)
}