package main

import (
	"fmt"
	"log"
	"net/http"
	"os"

	"github.com/go-chi/chi/v5"
)

func main() {

	cfg, err := loadConfig()
	if err != nil {
		log.Fatal(err)
	}

	if err = connectToDatabase(cfg); err != nil {
		log.Fatal(err)
	}

	router := chi.NewRouter()
	initRouter(router)

	server := &http.Server{
		Addr:    ":" + os.Getenv("PORT"),
		Handler: router,
	}

	fmt.Println("🍈")
	if err = server.ListenAndServe(); err != nil {
		log.Fatal(err)
	}

}
