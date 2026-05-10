package handler

import (
	"encoding/json"
	"net/http"
)

func RespondWithJSON(w http.ResponseWriter, status int, data any) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)
	json.NewEncoder(w).Encode(data)
}

func RespondWithError(w http.ResponseWriter, status int, msg string) {
	RespondWithJSON(w, status, map[string]string{"error": msg})
}
