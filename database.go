package main

import (
	"database/sql"
	"fmt"
	"os"

	_ "github.com/lib/pq"
)

type DB struct {
	Connection *sql.DB
}

func connectToDatabase(cfg Config) error {

	dbURL := os.Getenv("DB_URL")
	dbConn, err := sql.Open("postgres", dbURL)

	if err != nil {
		return fmt.Errorf("🔴 ailed to connect to database: %v", err)
	}

	cfg.DB.Connection = dbConn

	if err = cfg.DB.Connection.Ping(); err != nil {
		return fmt.Errorf("🔴 failed to connect to database: %v", err)
	}
	fmt.Println("connected to db 🟢")

	return nil
}
