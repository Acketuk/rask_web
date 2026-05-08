package main

import (
	"net/http"

	"github.com/Acketuk/rask_web.git/handler"
	"github.com/go-chi/chi/v5"
)

func initRouter(r *chi.Mux) {

	r.Get("/health", func(w http.ResponseWriter, r *http.Request) {
		handler.RespondWithJSON(w, map[string]string{
			"status": "ok",
		}, 200)
	})
}
