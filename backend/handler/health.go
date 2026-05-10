package handler

import "net/http"

func CheckHealth(w http.ResponseWriter, r *http.Request) {
	RespondWithJSON(w, http.StatusOK, map[string]string{
		"status": "ok",
	})
}
