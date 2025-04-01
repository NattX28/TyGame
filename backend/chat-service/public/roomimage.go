package public

import (
	"path/filepath"
	"strings"

	"github.com/gofiber/fiber/v2"
)

func GetImageRoomHandler(c *fiber.Ctx) error {
	nameFile := c.Params("nameFile")

	// Ensure no sneaky path traversal (like ../../../etc/passwd)
	if strings.Contains(nameFile, "..") || strings.Contains(nameFile, "/") || strings.Contains(nameFile, "\\") {
		return c.Status(fiber.StatusBadRequest).SendString("Invalid filename")
	}

	filePath := filepath.Join("./uploads/room-image", nameFile)

	if _, err := filepath.Abs(filePath); err != nil {
		return c.Status(fiber.StatusInternalServerError).SendString("Error resolving file path")
	}

	contentType := getContentType(filePath)
	if contentType == "" {
		return c.Status(fiber.StatusUnsupportedMediaType).SendString("Unsupported file type")
	}

	return c.SendFile(filePath)
}


func getContentType(path string) string {
	ext := filepath.Ext(path)
	switch ext {
	case ".jpg", ".jpeg", ".png", ".gif", ".jfif", ".webp":
		return "image/" + ext[1:]
	default:
		return ""
	}
}
