package routes

import (
	"strconv"

	"github.com/gofiber/fiber/v2"

	"community-service/db"
	"community-service/models"
)

func GetAllCommunities(c *fiber.Ctx) error {
	limit := 10

	if limitStr := c.Query("limit"); limitStr != "" {
		if parsedLimit, err := strconv.Atoi(limitStr); err == nil && parsedLimit > 0 {
			limit = parsedLimit
		}
	}

	var topCommunities []models.CommunityResponseAdmin

	if err := db.DB.Raw(`
		SELECT 
			c.id,
			c.name,
			c.description,
			c.category,
			c.image,
			COUNT(cm.user_id) AS member_count
		FROM
			communities c
		LEFT JOIN
			community_members cm
		ON
			c.id = cm.community_id
		GROUP BY
			c.id
		ORDER BY
			member_count DESC
		LIMIT ?
	`, limit).Scan(&topCommunities).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to fetch top communities",
		})
	}

	if topCommunities == nil {
		topCommunities = []models.CommunityResponseAdmin{}
	}

	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"message":      "Success",
		"communities": 	topCommunities,
	})
}
