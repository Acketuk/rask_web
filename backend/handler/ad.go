package handler

import (
	"encoding/json"
	"net/http"
	"strconv"

	"github.com/Acketuk/rask_web.git/middleware"
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
	userID, ok := middleware.GetUserID(r.Context())
	if !ok {
		RespondWithError(w, http.StatusUnauthorized, "unauthorized")
		return
	}

	var body struct {
		Title        string `json:"title"`
		Description  string `json:"description"`
		Price        int32  `json:"price"`
		CategoryID   string `json:"category_id"`
		Location     string `json:"location"`
		Provider     string `json:"provider"`
		Delivery     string `json:"delivery"`
		Availability string `json:"availability"`
	}
	if err := json.NewDecoder(r.Body).Decode(&body); err != nil {
		RespondWithError(w, http.StatusBadRequest, "invalid request body")
		return
	}
	if body.Title == "" || body.Description == "" || body.CategoryID == "" {
		RespondWithError(w, http.StatusBadRequest, "title, description and category are required")
		return
	}
	catID, err := uuid.Parse(body.CategoryID)
	if err != nil {
		RespondWithError(w, http.StatusBadRequest, "invalid category id")
		return
	}

	ad, err := h.svc.Create(r.Context(), service.CreateAdInput{
		Title:        body.Title,
		Description:  body.Description,
		Price:        body.Price,
		UserID:       userID,
		CategoryID:   catID,
		Location:     body.Location,
		Provider:     body.Provider,
		Delivery:     body.Delivery,
		Availability: body.Availability,
	})
	if err != nil {
		RespondWithError(w, http.StatusInternalServerError, "failed to create ad")
		return
	}
	RespondWithJSON(w, http.StatusCreated, ad)
}

func (h *AdHandler) GetAdsByUser(w http.ResponseWriter, r *http.Request) {
	userID, err := uuid.Parse(chi.URLParam(r, "userId"))
	if err != nil {
		RespondWithError(w, http.StatusBadRequest, "invalid user id")
		return
	}
	limit, offset := parsePagination(r)
	ads, err := h.svc.GetByUser(r.Context(), userID, limit, offset)
	if err != nil {
		RespondWithError(w, http.StatusInternalServerError, "failed to get ads")
		return
	}
	RespondWithJSON(w, http.StatusOK, mapAdRows(ads))
}

func (h *AdHandler) SearchAds(w http.ResponseWriter, r *http.Request) {
	q := r.URL.Query().Get("q")
	if q == "" {
		RespondWithJSON(w, http.StatusOK, []any{})
		return
	}
	limit, offset := parsePagination(r)
	ads, err := h.svc.Search(r.Context(), q, limit, offset)
	if err != nil {
		RespondWithError(w, http.StatusInternalServerError, "search failed")
		return
	}
	if ads == nil {
		RespondWithJSON(w, http.StatusOK, []AdResponse{})
		return
	}
	RespondWithJSON(w, http.StatusOK, mapAdRows(ads))
}

func (h *AdHandler) GetAdCount(w http.ResponseWriter, r *http.Request) {
	count, err := h.svc.Count(r.Context())
	if err != nil {
		RespondWithError(w, http.StatusInternalServerError, "failed to count ads")
		return
	}
	RespondWithJSON(w, http.StatusOK, map[string]int64{"count": count})
}

func (h *AdHandler) GetAds(w http.ResponseWriter, r *http.Request) {
	limit, offset := parsePagination(r)

	ads, err := h.svc.GetAll(r.Context(), limit, offset)
	if err != nil {
		RespondWithError(w, http.StatusInternalServerError, "failed to get ads")
		return
	}

	RespondWithJSON(w, http.StatusOK, mapAdRows(ads))
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

	RespondWithJSON(w, http.StatusOK, mapCategoryAdRows(ads))
}

func (h *AdHandler) UpdateAd(w http.ResponseWriter, r *http.Request) {
	RespondWithError(w, http.StatusUnauthorized, "unauthorized")
}

func (h *AdHandler) DeleteAd(w http.ResponseWriter, r *http.Request) {
	RespondWithError(w, http.StatusUnauthorized, "unauthorized")
}
