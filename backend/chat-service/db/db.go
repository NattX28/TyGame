package db

import (
	"log"
	"os"
	"chat-service/models"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

var DB *gorm.DB

func Connect() {
	var err error

	databaseURL := os.Getenv("DATABASE_URL_CHAT_SERVICE")
	DB, err = gorm.Open(postgres.Open(databaseURL), &gorm.Config{})
	if err != nil {
		log.Fatalf("Unable to connect to the database: %v", err)
	}

	log.Println("Connected to the database")
	
	Migrate()
}

func Migrate() {
	err := DB.AutoMigrate(&models.Message{}, &models.Room{}, &models.RoomMember{})
	if err != nil {
		log.Fatalf("Unable to migrate models: %v", err)
	}

	log.Println("Database migrated")
}

func Close() {
	log.Println("Database connection closed (handled by GORM at shutdown)")
}
