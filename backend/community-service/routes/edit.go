package routes

import (
	"fmt"
	"os"
	"path/filepath"

	"mime/multipart"

	"github.com/gofiber/fiber/v2"
	"github.com/google/uuid"
	"github.com/microcosm-cc/bluemonday"

	"community-service/db"
	"community-service/models"
	"community-service/utils"
)


func EditCommunityHandler(c *fiber.Ctx) error {
	var imagePath = "./uploads/profile/%s"

	commuID, err1 := uuid.Parse(c.Params("CommuID"))
	if err1 != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid Param"})
	}

	name := c.FormValue("name")
	description := c.FormValue("description")
	image, imageErr := c.FormFile("image")
	if name == "" || description == "" {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid request form"})
	}

	filename := ""
	var uploadedFile multipart.File
	if imageErr != nil {
		var err error
		uploadedFile, err = image.Open()
		if err != nil {
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to open file"})
		}
		defer uploadedFile.Close()
	
		filename = utils.GenerateUniqueFilename(uploadedFile)
		if filename == "" {
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid image type. Allowed: JPEG, PNG, GIF."})
		}

		const maxSize = 5 * 1024 * 1024 // 5MB
		if image.Size > maxSize {
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
				"error": "File size exceeds 5MB limit",
			})
		}
	}
	
	// Pull Community
	var community models.Community
	if err := db.DB.First(&community, commuID).Error; err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "Community not found"})
	}
	var existingCommunity models.Community
	if err := db.DB.Where("name = ? AND id != ?", name, commuID).First(&existingCommunity).Error; err == nil {
		return c.Status(fiber.StatusConflict).JSON(fiber.Map{"error": "Community name already exists"})
	}

	policy := bluemonday.StrictPolicy()
	safeName := policy.Sanitize(name)
	safeDes := policy.Sanitize(description)

	community.Name = safeName
	community.Description = safeDes
	if filename != "" {
		os.Remove(fmt.Sprintf(imagePath, community.Image))
		community.Image = filename
	}

	// Store Data
	if err := db.DB.Save(&community).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to edit community"})
	}
	if imageErr != nil {
		imagePath := "./uploads/profile/"
    	fullImagePath := filepath.Join(imagePath, community.Image)
		if err := c.SaveFile(image, fullImagePath); err != nil {
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
				"error": "Failed to save image",
			})
		}
	}

	return c.Status(fiber.StatusOK).JSON(fiber.Map{"message": "Community edited successfully"})
}
