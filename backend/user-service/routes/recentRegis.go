package routes

import (
	"strconv"
	"time"

	"user-service/db"
	"user-service/models"

	"github.com/gofiber/fiber/v2"
)

type MonthlyRegistration struct {
	Month string `json:"month"`
	Count int    `json:"count"`
}

func GetUserRegistrationStats(c *fiber.Ctx) error {
	monthLimitStr := c.Query("months", "6")
	monthLimit, err := strconv.Atoi(monthLimitStr)
	if err != nil || monthLimit <= 0 {
		monthLimit = 6
	}
	
	if monthLimit > 12 {
		monthLimit = 12
	}

	var results []MonthlyRegistration
	
	now := time.Now()
	
	var startOfMonth time.Time
	nextMonth := time.Date(now.Year(), now.Month(), 1, 0, 0, 0, 0, now.Location()).AddDate(0, -monthLimit+1, 0)
	for i := monthLimit - 1; i >= 0; i-- {
		startOfMonth = nextMonth.Add(time.Nanosecond)
		nextMonth = time.Date(startOfMonth.Year(), startOfMonth.Month()+1, 1, 0, 0, 0, 0, now.Location()).Add(-time.Nanosecond)

		var count int64
		if err := db.DB.Model(&models.User{}).Where("created_at BETWEEN ? AND ?", startOfMonth, nextMonth).Count(&count).Error; err != nil {
			return c.Status(500).JSON(fiber.Map{
				"error": "Failed to get registration stats",
			})
		}

		monthName := startOfMonth.Format("Jan")

		results = append(results, MonthlyRegistration{
			Month: monthName,
			Count: int(count),
		})
	}
	
	return c.JSON(fiber.Map{
		"message": "Successfully get registration stats",
		"stats":    results,
	})
}