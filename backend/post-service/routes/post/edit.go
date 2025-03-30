package post

import (
	"os"
	"strings"
	"time"
	"fmt"
	"path/filepath"
	"github.com/gofiber/fiber/v2"
	"github.com/microcosm-cc/bluemonday"
	"github.com/google/uuid"
	"mime/multipart"

	"post-service/db"
	"post-service/models"
)

func EditPostHandler(c *fiber.Ctx) error {
	postID, err := uuid.Parse(c.Params("PostID"))
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid post ID"})
	}

	// Pull Data
	var postReq models.Post
	if err := db.DB.First(&postReq, postID).Error; err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "Post not found"})
	}

	// Check Auth
	userID, err := uuid.Parse(c.Locals("UserID").(string))
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to get userID",
		})
	}
	if postReq.UserID != userID {
		return c.Status(fiber.StatusForbidden).JSON(fiber.Map{"error": "No Authorization"})
	}

	// Parse Multipart Form
	form, err := c.MultipartForm()
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid form data"})
	}

	// Sanitize and update content
	policy := bluemonday.StrictPolicy()
	if content := form.Value["content"]; len(content) > 0 {
		postReq.Content = policy.Sanitize(content[0])
	}

	// Update visibility
	if visibility := form.Value["visibility"]; len(visibility) > 0 {
		postReq.Visibility = visibility[0]
	}

	// Handle optional image upload
	if files, ok := form.File["image"]; ok && len(files) > 0 {
		file := files[0]
		extension := strings.ToLower(filepath.Ext(file.Filename))
		filename := fmt.Sprintf("%d%s", time.Now().UnixNano(), extension)

		imagePath := "uploads/posts/" + filename

		// Delete old image if it exists
		if postReq.Image != "" {
			if err := os.Remove(postReq.Image); err != nil && !os.IsNotExist(err) {
				return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to delete old image"})
			}
		}

		// Save the new file
		if err := saveFile(file, imagePath); err != nil {
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to save image"})
		}

		// Update the post's image field
		postReq.Image = filename
	}

	// Store Data
	if err := db.DB.Save(&postReq).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to update post"})
	}

	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"message": "Post edited successfully",
		"post": fiber.Map{
			"postID":      postReq.ID,
			"Content":     postReq.Content,
			"Image":       postReq.Image,
		},
	})
}

// saveFile saves the uploaded file to the specified path
func saveFile(file *multipart.FileHeader, path string) error {
	src, err := file.Open()
	if err != nil {
		return err
	}
	defer src.Close()

	dst, err := os.Create(path)
	if err != nil {
		return err
	}
	defer dst.Close()

	_, err = dst.ReadFrom(src)
	return err
}
