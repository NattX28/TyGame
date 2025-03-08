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
	
	for i := monthLimit - 1; i >= 0; i-- {
		targetMonth := now.AddDate(0, -i, 0)
		startOfMonth := time.Date(targetMonth.Year(), targetMonth.Month(), 1, 0, 0, 0, 0, targetMonth.Location())
		
		var nextMonth time.Time
		if i == 0 {
			nextMonth = now
		} else {
			nextMonth = time.Date(targetMonth.Year(), targetMonth.Month()+1, 1, 0, 0, 0, 0, targetMonth.Location())
		}
		
		var count int64
		if err := db.DB.Model(&models.User{}).Where("created_at BETWEEN ? AND ?", startOfMonth, nextMonth).Count(&count).Error; err != nil {
			return c.Status(500).JSON(fiber.Map{
				"error": "Failed to get registration stats",
			})
		}
		
		monthName := targetMonth.Format("Jan")
		
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