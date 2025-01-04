package main

import (
	"context"
	"log"

	"github.com/joho/godotenv"

	"post-service/db"
)

func createTable() {
	sql := `
	CREATE TABLE IF NOT EXISTS posts (
		id SERIAL PRIMARY KEY,
		title VARCHAR(255) NOT NULL,
		content TEXT NOT NULL,
		created_at TIMESTAMPTZ DEFAULT NOW()
	);`

	// Execute the query to create the table
	_, err := db.DB.Exec(context.Background(), sql)
	if err != nil {
		log.Fatalf("Failed to create table: %v", err)
	}
	log.Println("Table 'posts' created successfully")
}


func main() {
	err := godotenv.Load()
	if (err != nil) { log.Println("No .env file found, skipping..."); }

	// Connect to the database
	db.Connect()
	defer db.Close()

	createTable()
}