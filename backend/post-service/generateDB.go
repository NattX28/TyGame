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
		community_id INT NOT NULL,
		user_id INT NOT NULL,
		content TEXT NOT NULL,
		visibility VARCHAR(20) DEFAULT 'public' CHECK (visibility IN ('public', 'private', 'friends')),
		created_at TIMESTAMPTZ DEFAULT NOW()
	);

	CREATE TABLE IF NOT EXISTS comments (
		id SERIAL PRIMARY KEY,
		post_id INT NOT NULL,
		user_id INT NOT NULL,
		content TEXT NOT NULL,
		created_at TIMESTAMPTZ DEFAULT NOW(),
		FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE
	);

	CREATE TABLE IF NOT EXISTS likes (
		id SERIAL PRIMARY KEY,
		user_id INT NOT NULL,
		post_id INT NULL,
		comment_id INT NULL,
		created_at TIMESTAMPTZ DEFAULT NOW(),
		FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,
		FOREIGN KEY (comment_id) REFERENCES comments(id) ON DELETE CASCADE,
		CONSTRAINT unique_like UNIQUE (user_id, post_id, comment_id)
	);`


	// Execute the query to create the table
	_, err := db.DB.Exec(context.Background(), sql)
	if err != nil {
		log.Fatalf("Failed to create table: %v", err)
	}
	log.Println("Table created successfully")
}


func main() {
	err := godotenv.Load()
	if (err != nil) { log.Println("No .env file found, skipping..."); }

	// Connect to the database
	db.Connect()
	defer db.Close()

	createTable()
}