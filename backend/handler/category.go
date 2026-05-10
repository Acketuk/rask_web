package handler

import (
	"net/http"

	"github.com/Acketuk/rask_web.git/service"
	"github.com/go-chi/chi/v5"
	"github.com/google/uuid"
)

type CategoryHandler struct {
	svc *service.CategoryService
}

func NewCategoryHandler(svc *service.CategoryService) *CategoryHandler {
	return &CategoryHandler{svc: svc}
}

func (h *CategoryHandler) CreateCategory(w http.ResponseWriter, r *http.Request) {
	RespondWithError(w, http.StatusUnauthorized, "unauthorized")
}

func (h *CategoryHandler) GetCategories(w http.ResponseWriter, r *http.Request) {
	categories, err := h.svc.GetAll(r.Context())
	if err != nil {
		RespondWithError(w, http.StatusInternalServerError, "failed to get categories")
		return
	}

	RespondWithJSON(w, http.StatusOK, categories)
}

func (h *CategoryHandler) GetCategory(w http.ResponseWriter, r *http.Request) {
	id, err := uuid.Parse(chi.URLParam(r, "id"))
	if err != nil {
		RespondWithError(w, http.StatusBadRequest, "invalid category id")
		return
	}

	category, err := h.svc.GetByID(r.Context(), id)
	if err != nil {
		RespondWithError(w, http.StatusNotFound, "category not found")
		return
	}

	RespondWithJSON(w, http.StatusOK, category)
}

func (h *CategoryHandler) UpdateCategory(w http.ResponseWriter, r *http.Request) {
	RespondWithError(w, http.StatusUnauthorized, "unauthorized")
}

func (h *CategoryHandler) DeleteCategory(w http.ResponseWriter, r *http.Request) {
	RespondWithError(w, http.StatusUnauthorized, "unauthorized")
}
