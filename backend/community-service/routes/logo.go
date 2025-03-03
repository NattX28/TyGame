package routes

import (
	"strings"
	"path/filepath"

	"github.com/gofiber/fiber/v2"
)

func LogoCommunityHandler(c *fiber.Ctx) error {
	nameFile := c.Params("nameFile")

	// Ensure no sneaky path traversal (like ../../../etc/passwd)
	if strings.Contains(nameFile, "..") || strings.Contains(nameFile, "/") || strings.Contains(nameFile, "\\") {
		return c.Status(fiber.StatusBadRequest).SendString("Invalid filename")
	}

	// Construct full path (only allow files inside ./uploads/logo/)
	filePath := filepath.Join("./uploads/logo", nameFile)

	// Optionally, check file extension (allow only certain types)
	allowedExtensions := map[string]bool{
		".jpg":  true,
		".jpeg": true,
		".png":  true,
		".gif":  true,
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