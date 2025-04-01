package public

import (
	"strconv"

	"github.com/gofiber/fiber/v2"
	"github.com/google/uuid"

	"post-service/db"
)

func GetAllPostEachCommu(c *fiber.Ctx) error {
	limit := 5

	if limitStr := c.Query("limit"); limitStr != "" {
		if parsedLimit, err := strconv.Atoi(limitStr); err == nil && parsedLimit > 0 {
			limit = parsedLimit
		}
	}

	var communityPostCounts []struct {
		CommunityID uuid.UUID `json:"community_id"`
		PostCount   int       `json:"post_count"`
	}

	if err := db.DB.Raw(`
		SELECT 
			p.community_id,
			COUNT(p.id) AS post_count
		FROM
			posts p
		GROUP BY
			p.community_id
		ORDER BY
			post_count DESC
		LIMIT ?
	`, limit).Scan(&communityPostCounts).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to fetch post counts for communities",
		})
	}

	if communityPostCounts == nil {
		communityPostCounts = []struct {
			CommunityID uuid.UUID `json:"community_id"`
			PostCount   int       `json:"post_count"`
		}{}
	}

	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"message": "Success",
		"post_stats":    communityPostCounts,
	})
}
