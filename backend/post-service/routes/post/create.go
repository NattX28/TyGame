package post

import (
	"fmt"
	"os"
	"path/filepath"
	"strconv"
	"strings"
	"time"
	"github.com/gofiber/fiber/v2"
	"github.com/microcosm-cc/bluemonday"

	"post-service/db"
	"post-service/models"
)

var imagePath = "./uploads/posts/%s"

func CreatePostHandler(c *fiber.Ctx) error {
	userID, ok := c.Locals("UserID").(uint)
	if !ok {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{"error": "Unauthorized"})
	}

	// Parse form values
	communityIDStr := c.FormValue("community_id")
	content := c.FormValue("content")
	visibility := c.FormValue("visibility")

	if communityIDStr == "" || content == "" {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Missing required fields: community_id, content, visibility",
		})
	}

	// Convert CommunityID to uint
	communityID, err := strconv.ParseUint(communityIDStr, 10, 32)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid community_id format"})
	}

	// Validate Visibility Value
	if visibility != "" {
		validVisibilities := map[string]bool{"public": true, "private": true, "friends": true}
		if !validVisibilities[visibility] {
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
				"error": "Invalid visibility value. Allowed: public, private, friends",
			})
		}
	}

	policy := bluemonday.StrictPolicy()
	safeContent := policy.Sanitize(content)

	post := models.Post{
		UserID:      userID,
		CommunityID: uint(communityID),
		Content:     safeContent,
		Visibility:  visibility,
	}

	// Handle file upload
	file, err := c.FormFile("image")
	if err == nil {
		allowedTypes := map[string]bool{
			"image/jpeg": true,
			"image/png":  true,
			"image/gif":  true,
		}

		contentType := file.Header.Get("Content-Type")
		if !allowedTypes[contentType] {
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
				"error": "Invalid file type. Allowed: JPEG, PNG, GIF",
			})
		}

		// Check File Size (Max 5MB)
		const maxSize = 5 * 1024 * 1024 // 5MB
		if file.Size > maxSize {
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
				"error": "File size exceeds 5MB limit",
			})
		}

		// Generate unique filename
		extension := strings.ToLower(filepath.Ext(file.Filename))
		filename := fmt.Sprintf("%d%s", time.Now().UnixNano(), extension)

		// Save file
		savePath := fmt.Sprintf(imagePath, filename)
		if err := c.SaveFile(file, savePath); err != nil {
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
				"error": "Failed to save file",
			})
		}

		post.Image = filename
	}

	// Insert post into database
	result := db.DB.Create(&post)
	if result.Error != nil {
		if post.Image != "" {
			imagePath, err := filepath.Abs(fmt.Sprintf(imagePath, post.Image))
			if err != nil {
				return fmt.Errorf("failed to get absolute path: %v", err)
			}
			if err := os.Remove(imagePath); err != nil {
				return fmt.Errorf("failed to delete file: %v", err)
			}
		}

		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to create post",
		})
	}

	return c.Status(fiber.StatusCreated).JSON(fiber.Map{"message": "Post created successfully"})
}
