package main

import (
	"log"

	"github.com/joho/godotenv"

	"post-service/db"
)

func dropTables() {
	sql := `
	DROP TABLE IF EXISTS likes CASCADE;
	DROP TABLE IF EXISTS comments CASCADE;
	DROP TABLE IF EXISTS posts CASCADE;
	`

	// Execute the query to drop the old tables
	err := db.DB.Exec(sql)
	if err != nil {
		log.Fatalf("Failed to drop tables: %v", err)
	}
	log.Println("Old tables dropped successfully")
}

func main() {
	err := godotenv.Load()
	if (err != nil) { log.Println("No .env file found, skipping..."); }

	// Connect to the database
	db.Connect()
	defer db.Close()

	dropTables()
}