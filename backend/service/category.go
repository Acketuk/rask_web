package service

import (
	"context"

	"github.com/Acketuk/rask_web.git/internal/db"
	"github.com/google/uuid"
)

type CategoryService struct {
	queries *db.Queries
}

func NewCategoryService(queries *db.Queries) *CategoryService {
	return &CategoryService{queries: queries}
}

func (s *CategoryService) GetAll(ctx context.Context) ([]db.GetCategoriesRow, error) {
	return s.queries.GetCategories(ctx)
}

func (s *CategoryService) GetByID(ctx context.Context, id uuid.UUID) (db.GetCategoryRow, error) {
	return s.queries.GetCategory(ctx, id)
}
