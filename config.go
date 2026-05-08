package main

import (
	"fmt"
	"os"

	"github.com/joho/godotenv"
)

type Config struct {
	JwtSecret string
	DB
}

func loadConfig() (Config, error) {
	if err := godotenv.Load(); err != nil {
		return Config{}, fmt.Errorf("🔴 failed to load environment variables: %v", err)
	}

	fmt.Println("config loaded 🟢")

	return Config{
		JwtSecret: os.Getenv("JWT_SECRET"),
	}, nil
}
