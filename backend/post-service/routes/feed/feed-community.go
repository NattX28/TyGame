package feed

import (
	"github.com/gofiber/fiber/v2"
	"github.com/google/uuid"

	"post-service/db"
	"post-service/models"
)

func GetFeedCommunity(c *fiber.Ctx) error {
	commuID, err := uuid.Parse(c.Params("CommunityID"))
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid Param"})
	}

	userID, err := uuid.Parse(c.Locals("UserID").(string))
	if err != nil {
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
					"error": "Failed to get userID",
			})
	}

	page := c.QueryInt("page", 1)
	limit := 100
	offset := (page - 1) * limit

	var posts []models.FeedPost
	err = db.DB.Raw(`
    SELECT id, community_id, user_id, content, visibility, image,
           (COALESCE(likes_count, 0) * 2 + COALESCE(comments_count, 0) * 3 - (EXTRACT(EPOCH FROM NOW() - created_at) / 3600) * 5) AS score,
           COALESCE(likes_count, 0) AS likes_count,
           COALESCE(comments_count, 0) AS comments_count,
           EXISTS(SELECT 1 FROM likes WHERE post_id = p.id AND user_id = ?) AS liked,
           timestamp
    FROM (
        SELECT p.id, p.community_id, p.user_id, p.content, p.visibility, p.image, 
               p.timestamp, p.created_at,
               (SELECT COUNT(*) FROM likes WHERE post_id = p.id) AS likes_count,
               (SELECT COUNT(*) FROM comments WHERE post_id = p.id) AS comments_count
        FROM posts p
        WHERE p.visibility = 'public'
          AND p.community_id = ?
    ) AS p
    ORDER BY score DESC
    LIMIT ? OFFSET ?
	`, userID, commuID, limit, offset).Scan(&posts).Error

	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"message": "Error fetching posts"})
	}

	if posts == nil {
		posts = []models.FeedPost{}
	}

	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"message": "Posts fetched successfully",
		"posts":    posts,
	})
}