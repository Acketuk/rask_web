package handler

import (
	"net/http"
	"strconv"

	"github.com/Acketuk/rask_web.git/service"
	"github.com/go-chi/chi/v5"
	"github.com/google/uuid"
)

type AdHandler struct {
	svc *service.AdService
}

func NewAdHandler(svc *service.AdService) *AdHandler {
	return &AdHandler{svc: svc}
}

func parsePagination(r *http.Request) (limit, offset int32) {
	limit = 20
	if l := r.URL.Query().Get("limit"); l != "" {
		if v, err := strconv.Atoi(l); err == nil && v > 0 {
			limit = int32(v)
		}
	}
	if o := r.URL.Query().Get("offset"); o != "" {
		if v, err := strconv.Atoi(o); err == nil && v >= 0 {
			offset = int32(v)
		}
	}
	return
}

func (h *AdHandler) CreateAd(w http.ResponseWriter, r *http.Request) {
	RespondWithError(w, http.StatusUnauthorized, "unauthorized")
}

func (h *AdHandler) GetAds(w http.ResponseWriter, r *http.Request) {
	limit, offset := parsePagination(r)

	ads, err := h.svc.GetAll(r.Context(), limit, offset)
	if err != nil {
		RespondWithError(w, http.StatusInternalServerError, "failed to get ads")
		return
	}

	RespondWithJSON(w, http.StatusOK, ads)
}

func (h *AdHandler) GetAd(w http.ResponseWriter, r *http.Request) {
	id, err := uuid.Parse(chi.URLParam(r, "id"))
	if err != nil {
		RespondWithError(w, http.StatusBadRequest, "invalid ad id")
		return
	}

	ad, err := h.svc.GetByID(r.Context(), id)
	if err != nil {
		RespondWithError(w, http.StatusNotFound, "ad not found")
		return
	}

	RespondWithJSON(w, http.StatusOK, ad)
}

func (h *AdHandler) GetAdsByCategory(w http.ResponseWriter, r *http.Request) {
	categoryID, err := uuid.Parse(chi.URLParam(r, "categoryId"))
	if err != nil {
		RespondWithError(w, http.StatusBadRequest, "invalid category id")
		return
	}

	limit, offset := parsePagination(r)

	ads, err := h.svc.GetByCategory(r.Context(), categoryID, limit, offset)
	if err != nil {
		RespondWithError(w, http.StatusInternalServerError, "failed to get ads")
		return
	}

	RespondWithJSON(w, http.StatusOK, ads)
}

func (h *AdHandler) UpdateAd(w http.ResponseWriter, r *http.Request) {
	RespondWithError(w, http.StatusUnauthorized, "unauthorized")
}

func (h *AdHandler) DeleteAd(w http.ResponseWriter, r *http.Request) {
	RespondWithError(w, http.StatusUnauthorized, "unauthorized")
}
