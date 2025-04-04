package db

import (
	"log"
	"os"

	"post-service/models"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

var DB *gorm.DB

func Connect() {
	databaseURL := os.Getenv("DATABASE_URL_POST_SERVICE")
	if databaseURL == "" {
		log.Fatal("DATABASE_URL is not set")
	}
	var err error
	DB, err = gorm.Open(postgres.Open(databaseURL), &gorm.Config{})
	if err != nil {
		log.Fatalf("Unable to connect to the database: %v", err)
	}

	log.Println("Connected to the database")
	
	// DropTables()
	Migrate()
}

func Migrate() {
	err := DB.AutoMigrate(&models.Post{}, &models.Comment{}, &models.Like{})
	if err != nil {
		log.Fatalf("Unable to migrate models: %v", err)
	}

	log.Println("Database migrated")
}

func DropTables() {
	err := DB.Migrator().DropTable(&models.Post{}, &models.Comment{}, &models.Like{})
	if err != nil {
		log.Fatalf("Unable to drop tables: %v", err)
	}
	log.Println("Tables dropped successfully")
}

func Close() {
	log.Println("Database connection closed (handled by GORM at shutdown)")
}
