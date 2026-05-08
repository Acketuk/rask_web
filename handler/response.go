package handler

import (
	"encoding/json"
	"net/http"
)

func RespondWithJSON(w http.ResponseWriter, data any, status int) {
	w.WriteHeader(status)
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(data)
}

func RespondWithError(w http.ResponseWriter, status int, msg string) {
	w.WriteHeader(status)
	w.Header().Set("Content-Type", "application/json")
	RespondWithJSON(
		w,
		map[string]string{"error": msg},
		status)
}
