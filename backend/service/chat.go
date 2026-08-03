package service

import (
	"context"
	"database/sql"
	"errors"
	"time"

	"github.com/Acketuk/rask_web.git/internal/db"
	"github.com/google/uuid"
)

type ChatService struct {
	queries *db.Queries
}

func NewChatService(queries *db.Queries) *ChatService {
	return &ChatService{queries: queries}
}

type ConversationDetail struct {
	ID         uuid.UUID    `json:"id"`
	AdID       uuid.UUID    `json:"ad_id"`
	AdTitle    string       `json:"ad_title"`
	BuyerID    uuid.UUID    `json:"buyer_id"`
	BuyerName  string       `json:"buyer_name"`
	SellerID   uuid.UUID    `json:"seller_id"`
	SellerName string       `json:"seller_name"`
	Messages   []db.Message `json:"messages"`
}

// GetOrCreate returns an existing conversation for (ad, buyer) or creates one.
// It looks up the seller from the ad's user_id.
func (s *ChatService) GetOrCreate(ctx context.Context, adID, buyerID uuid.UUID) (db.Conversation, error) {
	// Fetch ad to get seller
	ad, err := s.queries.GetOneAd(ctx, adID)
	if err != nil {
		return db.Conversation{}, err
	}
	if ad.UserID == buyerID {
		return db.Conversation{}, errors.New("cannot message your own ad")
	}
	return s.queries.GetOrCreateConversation(ctx, adID, buyerID, ad.UserID)
}

// ListForUser returns all conversations the user is part of.
func (s *ChatService) ListForUser(ctx context.Context, userID uuid.UUID) (interface{}, error) {
	rows, err := s.queries.GetConversationsByUser(ctx, userID)
	if err != nil {
		return nil, err
	}
	if rows == nil {
		return []db.ConversationRow{}, nil
	}
	return rows, nil
}

// GetWithMessages returns the conversation and its messages, verifying the user is a member.
func (s *ChatService) GetWithMessages(ctx context.Context, convID, userID uuid.UUID) (ConversationDetail, error) {
	conv, err := s.queries.GetConversationByID(ctx, convID)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return ConversationDetail{}, errors.New("not found")
		}
		return ConversationDetail{}, err
	}
	if conv.BuyerID != userID && conv.SellerID != userID {
		return ConversationDetail{}, errors.New("access denied")
	}
	msgs, err := s.queries.GetMessagesByConversation(ctx, convID)
	if err != nil {
		return ConversationDetail{}, err
	}
	if msgs == nil {
		msgs = []db.Message{}
	}
	return ConversationDetail{
		ID:         conv.ID,
		AdID:       conv.AdID,
		AdTitle:    conv.AdTitle,
		BuyerID:    conv.BuyerID,
		BuyerName:  conv.BuyerName,
		SellerID:   conv.SellerID,
		SellerName: conv.SellerName,
		Messages:   msgs,
	}, nil
}

// VerifyMember checks the user belongs to the conversation and returns their display name.
func (s *ChatService) VerifyMember(ctx context.Context, convID, userID uuid.UUID) (string, error) {
	conv, err := s.queries.GetConversationByID(ctx, convID)
	if err != nil {
		return "", errors.New("access denied")
	}
	switch userID {
	case conv.BuyerID:
		return conv.BuyerName, nil
	case conv.SellerID:
		return conv.SellerName, nil
	default:
		return "", errors.New("access denied")
	}
}

// SendMessage persists a message and bumps conversation.updated_at.
func (s *ChatService) SendMessage(convID, senderID uuid.UUID, content string) (db.Message, error) {
	ctx := context.Background()
	msg, err := s.queries.InsertMessage(ctx, convID, senderID, content)
	if err != nil {
		return db.Message{}, err
	}
	_ = s.queries.TouchConversation(ctx, convID, time.Now())
	return msg, nil
}
