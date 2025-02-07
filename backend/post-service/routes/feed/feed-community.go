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

	var posts []models.FeedPost
	err = db.DB.Raw(`
    SELECT community_id, user_id, content, visibility, image, created_at,
           (COALESCE(likes_count, 0) * 3 + COALESCE(comments_count, 0) * 5 + COALESCE(shares_count, 0) * 8 - 
           (EXTRACT(EPOCH FROM NOW() - created_at) / 3600) * 2) AS score
    FROM (
        SELECT p.community_id, p.user_id, p.content, p.visibility, p.image, p.created_at,
               (SELECT COUNT(*) FROM likes WHERE post_id = p.id) AS likes_count,
               (SELECT COUNT(*) FROM comments WHERE post_id = p.id) AS comments_count,
               0 AS shares_count
        FROM posts p
        WHERE p.visibility = 'public'
          AND p.community_id = ?
    ) AS post_scores
    ORDER BY score DESC
	`, commuID).Scan(&posts).Error

	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"message": "Error fetching posts"})
	}

	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"message": "Posts fetched successfully",
		"data":    posts,
	})
}