package handler

import (
	"encoding/json"
	"net/http"

	"github.com/Acketuk/rask_web.git/middleware"
	"github.com/Acketuk/rask_web.git/service"
	"github.com/go-chi/chi/v5"
	"github.com/google/uuid"
)

type UserHandler struct {
	svc *service.UserService
}

func NewUserHandler(svc *service.UserService) *UserHandler {
	return &UserHandler{svc: svc}
}

func (h *UserHandler) RegisterUser(w http.ResponseWriter, r *http.Request) {
	var req struct {
		Name        string `json:"name"`
		Email       string `json:"email"`
		Password    string `json:"password"`
		PhoneNumber string `json:"phone_number"`
	}
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		RespondWithError(w, http.StatusBadRequest, "invalid request body")
		return
	}

	user, err := h.svc.Register(r.Context(), req.Name, req.Email, req.Password, req.PhoneNumber)
	if err != nil {
		RespondWithError(w, http.StatusInternalServerError, "failed to create user")
		return
	}

	RespondWithJSON(w, http.StatusCreated, user)
}

func (h *UserHandler) LoginUser(w http.ResponseWriter, r *http.Request) {
	var req struct {
		Email    string `json:"email"`
		Password string `json:"password"`
	}
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		RespondWithError(w, http.StatusBadRequest, "invalid request body")
		return
	}

	result, err := h.svc.Login(r.Context(), req.Email, req.Password)
	if err != nil {
		RespondWithError(w, http.StatusUnauthorized, "invalid credentials")
		return
	}

	RespondWithJSON(w, http.StatusOK, result)
}

func (h *UserHandler) RefreshToken(w http.ResponseWriter, r *http.Request) {
	var req struct {
		RefreshToken string `json:"refresh_token"`
	}
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		RespondWithError(w, http.StatusBadRequest, "invalid request body")
		return
	}

	accessToken, err := h.svc.RefreshToken(r.Context(), req.RefreshToken)
	if err != nil {
		RespondWithError(w, http.StatusUnauthorized, err.Error())
		return
	}

	RespondWithJSON(w, http.StatusOK, map[string]string{"access_token": accessToken})
}

func (h *UserHandler) Logout(w http.ResponseWriter, r *http.Request) {
	var req struct {
		RefreshToken string `json:"refresh_token"`
	}
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		RespondWithError(w, http.StatusBadRequest, "invalid request body")
		return
	}

	if err := h.svc.Logout(r.Context(), req.RefreshToken); err != nil {
		RespondWithError(w, http.StatusInternalServerError, "failed to logout")
		return
	}

	RespondWithJSON(w, http.StatusOK, map[string]string{"message": "logged out"})
}

func (h *UserHandler) GetMe(w http.ResponseWriter, r *http.Request) {
	userID, ok := middleware.GetUserID(r.Context())
	if !ok {
		RespondWithError(w, http.StatusUnauthorized, "unauthorized")
		return
	}
	user, err := h.svc.GetByID(r.Context(), userID)
	if err != nil {
		RespondWithError(w, http.StatusNotFound, "user not found")
		return
	}
	RespondWithJSON(w, http.StatusOK, user)
}

func (h *UserHandler) GetUser(w http.ResponseWriter, r *http.Request) {
	id, err := uuid.Parse(chi.URLParam(r, "id"))
	if err != nil {
		RespondWithError(w, http.StatusBadRequest, "invalid user id")
		return
	}

	user, err := h.svc.GetByID(r.Context(), id)
	if err != nil {
		RespondWithError(w, http.StatusNotFound, "user not found")
		return
	}

	RespondWithJSON(w, http.StatusOK, user)
}

func (h *UserHandler) UpdateUser(w http.ResponseWriter, r *http.Request) {
	RespondWithError(w, http.StatusUnauthorized, "unauthorized")
}

func (h *UserHandler) DeleteUser(w http.ResponseWriter, r *http.Request) {
	RespondWithError(w, http.StatusUnauthorized, "unauthorized")
}
