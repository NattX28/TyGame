package post

import (
	"github.com/gofiber/fiber/v2"

	"post-service/db"
	"post-service/models"
)

func CreatePostHandler(c *fiber.Ctx) error {
	// Unpack Body To CreatePost Form
	var createPostReq models.CreatePostRequest
	if err := c.BodyParser(&createPostReq); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid request body",
		})
	}

	var postReq models.Post
	userID := c.Locals("UserID").(uint);
	post := postReq{
		UserID:      userID,
		CommunityID: createPostReq.CommunityID,
		Content:     createPostReq.Content,
		Visibility:  createPostReq.Visibility,
	}

	result := db.DB.Create(&post)
	if result.Error != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to create post"})
	}

	return c.Status(fiber.StatusCreated).JSON(fiber.Map{"message": "Post created successfully"})
}