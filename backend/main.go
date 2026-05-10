package main

import (
	"fmt"
	"log"
	"net/http"
	"os"

	"github.com/Acketuk/rask_web.git/handler"
	"github.com/Acketuk/rask_web.git/internal/db"
	"github.com/Acketuk/rask_web.git/service"
	"github.com/go-chi/chi/v5"
	"github.com/joho/godotenv"
)

func main() {
	if err := godotenv.Load(); err != nil {
		log.Fatal(err)
	}

	jwtKey := os.Getenv("JWT_SECRET")
	host := os.Getenv("HOST")
	port := os.Getenv("PORT")

	sqlDB, err := connectToDatabase()
	if err != nil {
		log.Fatal(err)
	}

	queries := db.New(sqlDB)

	userHandler := handler.NewUserHandler(service.NewUserService(queries, jwtKey))
	categoryHandler := handler.NewCategoryHandler(service.NewCategoryService(queries))
	adHandler := handler.NewAdHandler(service.NewAdService(queries))

	router := chi.NewRouter()
	initRouter(router, userHandler, categoryHandler, adHandler)

	server := &http.Server{
		Addr:    ":" + port,
		Handler: router,
	}

	fmt.Printf("server has started on: http://%s:%s\n", host, port)

	if err = server.ListenAndServe(); err != nil {
		log.Fatal(err)
	}
}
