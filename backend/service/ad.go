package service

import (
	"context"
	"encoding/json"
	"fmt"
	"math/rand"

	"github.com/Acketuk/rask_web.git/internal/db"
	"github.com/google/uuid"
	"github.com/sqlc-dev/pqtype"
)

type CreateAdInput struct {
	Title       string
	Description string
	Price       int32
	UserID      uuid.UUID
	CategoryID  uuid.UUID
	Location    string
	Provider    string
	Delivery    string
	Availability string
}

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

func (s *AdService) GetByUser(ctx context.Context, userID uuid.UUID, limit, offset int32) ([]db.GetAllAdsRow, error) {
	return s.queries.GetAdsByUser(ctx, db.GetAdsByUserParams{UserID: userID, Limit: limit, Offset: offset})
}

func (s *AdService) Count(ctx context.Context) (int64, error) {
	return s.queries.CountAds(ctx)
}

func (s *AdService) Create(ctx context.Context, in CreateAdInput) (db.Ad, error) {
	imageURL := fmt.Sprintf("https://picsum.photos/seed/%d/800/500", rand.Intn(900)+1)
	raw, _ := json.Marshal(map[string]string{
		"location":     in.Location,
		"provider":     in.Provider,
		"delivery":     in.Delivery,
		"availability": in.Availability,
		"image":        imageURL,
	})
	return s.queries.CreateAd(ctx, db.CreateAdParams{
		Title:       in.Title,
		Description: in.Description,
		Price:       in.Price,
		UserID:      in.UserID,
		CategoryID:  in.CategoryID,
		Attributes:  pqtype.NullRawMessage{RawMessage: raw, Valid: true},
	})
}

func (s *AdService) Search(ctx context.Context, query string, limit, offset int32) ([]db.GetAllAdsRow, error) {
	return s.queries.SearchAds(ctx, db.SearchAdsParams{Query: query, Limit: limit, Offset: offset})
}

func (s *AdService) GetByCategory(ctx context.Context, categoryID uuid.UUID, limit, offset int32) ([]db.GetAdsByCategoryRow, error) {
	return s.queries.GetAdsByCategory(ctx, db.GetAdsByCategoryParams{
		CategoryID: categoryID,
		Limit:      limit,
		Offset:     offset,
	})
}
