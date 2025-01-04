package db

import (
	"context"
	"log"
	"os"
	"github.com/jackc/pgx/v5/pgxpool"
)

var DB *pgxpool.Pool

func Connect() {
	databaseURL := os.Getenv("DATABASE_URL")
	if databaseURL == "" {
		log.Fatal("DATABASE_URL is not set")
	}

	// Connect to the database
	conn, err := pgxpool.New(context.Background(), databaseURL)
	if err != nil {
		log.Fatalf("Unable to connect to database: %v", err)
	}

	DB = conn

	log.Println("Connected to the database")
}


func Close() {
	if DB != nil {
		DB.Close()
		log.Println("Database connection closed")
	}
}
