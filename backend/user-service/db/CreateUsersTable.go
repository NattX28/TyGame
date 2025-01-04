package db

import (
	"context"
	"log"
)

func CreateUsersTable() {
	query := `
	CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password TEXT NOT NULL
);
`

	log.Println("Attempting to create users table...")
	_, err := DB.Exec(context.Background(), query)
	if err != nil {
		log.Fatalf("Error creating users table: %v", err)
	} else {
		log.Println("Users table created or already exists")
	}
}
