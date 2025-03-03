package routes

import (
    "fmt"

    "github.com/gofiber/fiber/v2"
    "github.com/microcosm-cc/bluemonday"
    "github.com/google/uuid"

    "community-service/db"
    "community-service/utils"
    "community-service/models"
)

func CreateCommunityHandler(c *fiber.Ctx) error {
    imagePath := "./uploads/profile/%s"

    name := c.FormValue("name")
    description := c.FormValue("description")
    category := c.FormValue("category")
    image, err := c.FormFile("image")
    if name == "" || description == "" || category == "" || err != nil {
        return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid request form"})
    }

    uploadedFile, err := image.Open()
    if err != nil {
        return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to open file"})
    }
    defer uploadedFile.Close()

    filename := utils.GenerateUniqueFilename(uploadedFile)
    if filename == "" {
        return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid image type. Allowed: JPEG, PNG, GIF."})
    }

    const maxSize = 5 * 1024 * 1024 // 5MB
    if image.Size > maxSize {
        return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
            "error": "File size exceeds 5MB limit",
        })
    }
    
    // Pull Community
    var existingCommunity models.Community
    if err := db.DB.Where("name = ?", name).First(&existingCommunity).Error; err == nil {
        return c.Status(fiber.StatusConflict).JSON(fiber.Map{"error": "Community name already exists"})
    }

    userID, err := uuid.Parse(c.Locals("UserID").(string))
    if err != nil {
        return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
            "error": "Failed to get userID",
        })
    }

    policy := bluemonday.StrictPolicy()
    safeName := policy.Sanitize(name)
    safeDes := policy.Sanitize(description)
    safeCategory := policy.Sanitize(category)

    community := models.Community{
        Name: 		 		safeName,
        Description: 	safeDes,
        Category: 		safeCategory,
        Image: 				filename,
        CreatorID:    userID,
    }

    // Store Data
    result := db.DB.Create(&community)
    if result.Error != nil {
        return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to create community"})
    }

    fullImagePath := fmt.Sprintf(imagePath, filename)
    if err := c.SaveFile(image, fullImagePath); err != nil {
        return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
            "error": "Failed to save image",
        })
    }

    return c.Status(fiber.StatusOK).JSON(fiber.Map{"message": "Community created successfully"})
}