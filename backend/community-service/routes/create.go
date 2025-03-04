package routes

import (
	"path/filepath"
    
    "github.com/gofiber/fiber/v2"
    "github.com/google/uuid"
    "github.com/microcosm-cc/bluemonday"

    "community-service/db"
    "community-service/models"
    "community-service/utils"
)

func CreateCommunityHandler(c *fiber.Ctx) error {
    // Get form data
    name := c.FormValue("name")
    description := c.FormValue("description")
    category := c.FormValue("category")
    image, err := c.FormFile("image")

    if name == "" || description == "" || category == "" || err != nil {
        return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid request form"})
    }

    // Open uploaded file
    uploadedFile, err := image.Open()
    if err != nil {
        return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to open file"})
    }
    defer uploadedFile.Close()

    filename := utils.GenerateUniqueFilename(uploadedFile)
    if filename == "" {
        return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid image type. Allowed: JPEG, PNG, GIF."})
    }

    const maxSize = 5 * 1024 * 1024 // 5MB limit
    if image.Size > maxSize {
        return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
            "error": "File size exceeds 5MB limit",
        })
    }

    // Check for existing community name
    var existingCommunity models.Community
    if err := db.DB.Where("name = ?", name).First(&existingCommunity).Error; err == nil {
        return c.Status(fiber.StatusConflict).JSON(fiber.Map{"error": "Community name already exists"})
    }

    // Get userID from context
    userID, err := uuid.Parse(c.Locals("UserID").(string))
    if err != nil {
        return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
            "error": "Failed to get userID",
        })
    }

    // Sanitize inputs
    policy := bluemonday.StrictPolicy()
    safeName := policy.Sanitize(name)
    safeDes := policy.Sanitize(description)
    safeCategory := policy.Sanitize(category)

    community := models.Community{
        Name:        safeName,
        Description: safeDes,
        Category:    safeCategory,
        Image:       filename,
        CreatorID:   userID,
    }

    // Save file to disk
	imagePath := "./uploads/profile/"
    fullImagePath := filepath.Join(imagePath, community.Image)
    if err := c.SaveFile(image, fullImagePath); err != nil {
        return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
            "error": "Failed to save image",
        })
    }

    // Save community to DB
    if err := db.DB.Create(&community).Error; err != nil {
        return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to create community"})
    }

    return c.Status(fiber.StatusOK).JSON(fiber.Map{"message": "Community created successfully"})
}
