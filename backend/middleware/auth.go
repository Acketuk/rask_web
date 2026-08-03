package middleware

import (
	"context"
	"encoding/json"
	"net/http"
	"strings"

	"github.com/Acketuk/rask_web.git/internal/auth"
	"github.com/google/uuid"
)

type contextKey string

const UserIDKey contextKey = "user_id"

func GetUserID(ctx context.Context) (uuid.UUID, bool) {
	id, ok := ctx.Value(UserIDKey).(uuid.UUID)
	return id, ok
}

func RequireAuth(jwtSecret string) func(http.Handler) http.Handler {
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			header := r.Header.Get("Authorization")
			if !strings.HasPrefix(header, "Bearer ") {
				w.Header().Set("Content-Type", "application/json")
				w.WriteHeader(http.StatusUnauthorized)
				_ = json.NewEncoder(w).Encode(map[string]string{"error": "missing authorization header"})
				return
			}

			userID, err := auth.ValidateAccessToken(strings.TrimPrefix(header, "Bearer "), jwtSecret)
			if err != nil {
				w.Header().Set("Content-Type", "application/json")
				w.WriteHeader(http.StatusUnauthorized)
				_ = json.NewEncoder(w).Encode(map[string]string{"error": "invalid or expired token"})
				return
			}

			next.ServeHTTP(w, r.WithContext(context.WithValue(r.Context(), UserIDKey, userID)))
		})
	}
}
