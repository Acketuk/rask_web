package main

import (
	"database/sql"
	"fmt"
	"os"

	_ "github.com/lib/pq"
)

func connectToDatabase() (*sql.DB, error) {
	conn, err := sql.Open("postgres", os.Getenv("DB_URL"))
	if err != nil {
		return nil, fmt.Errorf("🔴 failed to open database: %v", err)
	}

	if err = conn.Ping(); err != nil {
		return nil, fmt.Errorf("🔴 failed to connect to database: %v", err)
	}

	return conn, nil
}
