package public

import (
	"os"
	"log"
	"fmt"
	"path/filepath"

	"github.com/gofiber/fiber/v2"
	"github.com/google/uuid"

	"user-service/db"
	"user-service/models"
)

func GetAvatarHandler(c *fiber.Ctx) error {
	userID, err := uuid.Parse(c.Params("userID"))
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid user ID"})
	}

	// Pull Post
	var user models.User
	if err := db.DB.First(&user, userID).Error; err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "User not found"})
	}

	filePath := filepath.Join("./uploads/users/", user.ImageName)
	log.Println("Avatar path: ", filePath)

	// Get current working directory
	mydir, err := os.Getwd()
	if err != nil {
		fmt.Println(err)
	}
	fmt.Println("Current working directory:", mydir)

	// List all directories and files in the current working directory
	files, err := os.ReadDir(mydir)
	if err != nil {
		fmt.Println(err)
	}
	for _, file := range files {
		fmt.Println(file.Name())
	}

	if _, err := filepath.Abs(filePath); err != nil {
		return c.Status(fiber.StatusInternalServerError).SendString("Error resolving file path")
	}

	return c.SendFile(filePath)
}

func getContentType(path string) string {
	ext := filepath.Ext(path)
	switch ext {
	case ".jpg", ".jpeg", ".png", ".gif":
		return "image/" + ext[1:]
	default:
		return ""
	}
}
