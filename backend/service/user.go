package service

import (
	"context"
	"database/sql"
	"fmt"
	"time"

	"github.com/Acketuk/rask_web.git/internal/auth"
	"github.com/Acketuk/rask_web.git/internal/db"
	"github.com/google/uuid"
)

const (
	accessTokenDuration  = 15 * time.Minute
	refreshTokenDuration = 7 * 24 * time.Hour
)

type LoginResult struct {
	AccessToken  string `json:"access_token"`
	RefreshToken string `json:"refresh_token"`
}

type UserService struct {
	queries   *db.Queries
	jwtSecret string
}

func NewUserService(queries *db.Queries, jwtSecret string) *UserService {
	return &UserService{queries: queries, jwtSecret: jwtSecret}
}

func (s *UserService) Register(ctx context.Context, name, email, password, phone string) (db.CreateUserRow, error) {
	hash, err := auth.HashPassword(password)
	if err != nil {
		return db.CreateUserRow{}, fmt.Errorf("failed to hash password: %w", err)
	}

	var phoneNull sql.NullString
	if phone != "" {
		phoneNull = sql.NullString{String: phone, Valid: true}
	}

	return s.queries.CreateUser(ctx, db.CreateUserParams{
		Name:        name,
		Email:       email,
		Password:    hash,
		PhoneNumber: phoneNull,
	})
}

func (s *UserService) Login(ctx context.Context, email, password string) (LoginResult, error) {
	user, err := s.queries.GetUserByEmail(ctx, email)
	if err != nil {
		return LoginResult{}, fmt.Errorf("invalid credentials")
	}

	if err = auth.CheckPassword(user.Password, password); err != nil {
		return LoginResult{}, fmt.Errorf("invalid credentials")
	}

	accessToken, err := auth.GenerateAccessToken(user.ID, s.jwtSecret, accessTokenDuration)
	if err != nil {
		return LoginResult{}, fmt.Errorf("failed to generate access token")
	}

	refreshToken, err := auth.GenerateRefreshToken()
	if err != nil {
		return LoginResult{}, fmt.Errorf("failed to generate refresh token")
	}

	_, err = s.queries.CreateRefreshToken(ctx, db.CreateRefreshTokenParams{
		UserID:    user.ID,
		Token:     refreshToken,
		ExpiresAt: time.Now().Add(refreshTokenDuration),
	})
	if err != nil {
		return LoginResult{}, fmt.Errorf("failed to store refresh token")
	}

	return LoginResult{AccessToken: accessToken, RefreshToken: refreshToken}, nil
}

func (s *UserService) RefreshToken(ctx context.Context, refreshToken string) (string, error) {
	stored, err := s.queries.GetRefreshToken(ctx, refreshToken)
	if err != nil {
		return "", fmt.Errorf("invalid refresh token")
	}

	if time.Now().After(stored.ExpiresAt) {
		_ = s.queries.DeleteRefreshToken(ctx, refreshToken)
		return "", fmt.Errorf("refresh token expired")
	}

	return auth.GenerateAccessToken(stored.UserID, s.jwtSecret, accessTokenDuration)
}

func (s *UserService) Logout(ctx context.Context, refreshToken string) error {
	return s.queries.DeleteRefreshToken(ctx, refreshToken)
}

func (s *UserService) GetByID(ctx context.Context, id uuid.UUID) (db.GetUserByIDRow, error) {
	return s.queries.GetUserByID(ctx, id)
}
