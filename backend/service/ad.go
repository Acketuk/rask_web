package service

import (
	"context"

	"github.com/Acketuk/rask_web.git/internal/db"
	"github.com/google/uuid"
)

type AdService struct {
	queries *db.Queries
}

func NewAdService(queries *db.Queries) *AdService {
	return &AdService{queries: queries}
}

func (s *AdService) GetAll(ctx context.Context, limit, offset int32) ([]db.GetAllAdsRow, error) {
	return s.queries.GetAllAds(ctx, db.GetAllAdsParams{Limit: limit, Offset: offset})
}

func (s *AdService) GetByID(ctx context.Context, id uuid.UUID) (db.Ad, error) {
	return s.queries.GetOneAd(ctx, id)
}

func (s *AdService) GetByCategory(ctx context.Context, categoryID uuid.UUID, limit, offset int32) ([]db.GetAdsByCategoryRow, error) {
	return s.queries.GetAdsByCategory(ctx, db.GetAdsByCategoryParams{
		CategoryID: categoryID,
		Limit:      limit,
		Offset:     offset,
	})
}
