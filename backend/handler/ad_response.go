package handler

import (
	"database/sql"
	"encoding/json"

	"github.com/Acketuk/rask_web.git/internal/db"
	"github.com/google/uuid"
)

type AdResponse struct {
	ID          uuid.UUID       `json:"id"`
	Title       string          `json:"title"`
	Description string          `json:"description"`
	Price       int32           `json:"price"`
	CreatedAt   sql.NullTime    `json:"created_at"`
	UserID      uuid.UUID       `json:"user_id"`
	CategoryID  uuid.UUID       `json:"category_id"`
	Attributes  json.RawMessage `json:"attributes"`
}

func toAdResponse(r db.GetAllAdsRow) AdResponse {
	attrs := json.RawMessage("null")
	if r.Attributes.Valid {
		attrs = json.RawMessage(r.Attributes.RawMessage)
	}
	return AdResponse{
		ID:          r.ID,
		Title:       r.Title,
		Description: r.Description,
		Price:       r.Price,
		CreatedAt:   r.CreatedAt,
		UserID:      r.UserID,
		CategoryID:  r.CategoryID,
		Attributes:  attrs,
	}
}

func toAdResponseFromCategory(r db.GetAdsByCategoryRow) AdResponse {
	attrs := json.RawMessage("null")
	if r.Attributes.Valid {
		attrs = json.RawMessage(r.Attributes.RawMessage)
	}
	return AdResponse{
		ID:          r.ID,
		Title:       r.Title,
		Description: r.Description,
		Price:       r.Price,
		CreatedAt:   r.CreatedAt,
		UserID:      r.UserID,
		CategoryID:  r.CategoryID,
		Attributes:  attrs,
	}
}

func mapAdRows(rows []db.GetAllAdsRow) []AdResponse {
	out := make([]AdResponse, len(rows))
	for i, r := range rows {
		out[i] = toAdResponse(r)
	}
	return out
}

func mapCategoryAdRows(rows []db.GetAdsByCategoryRow) []AdResponse {
	out := make([]AdResponse, len(rows))
	for i, r := range rows {
		out[i] = toAdResponseFromCategory(r)
	}
	return out
}
