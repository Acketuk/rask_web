package db

import (
	"context"
	"database/sql"
	"time"

	"github.com/google/uuid"
)

// ─── Models ──────────────────────────────────────────────────────────────────

type Conversation struct {
	ID        uuid.UUID    `json:"id"`
	AdID      uuid.UUID    `json:"ad_id"`
	BuyerID   uuid.UUID    `json:"buyer_id"`
	SellerID  uuid.UUID    `json:"seller_id"`
	CreatedAt sql.NullTime `json:"created_at"`
	UpdatedAt sql.NullTime `json:"updated_at"`
}

type Message struct {
	ID             uuid.UUID    `json:"id"`
	ConversationID uuid.UUID    `json:"conversation_id"`
	SenderID       uuid.UUID    `json:"sender_id"`
	Content        string       `json:"content"`
	CreatedAt      sql.NullTime `json:"created_at"`
}

type ConversationRow struct {
	ID           uuid.UUID    `json:"id"`
	AdID         uuid.UUID    `json:"ad_id"`
	AdTitle      string       `json:"ad_title"`
	BuyerID      uuid.UUID    `json:"buyer_id"`
	BuyerName    string       `json:"buyer_name"`
	SellerID     uuid.UUID    `json:"seller_id"`
	SellerName   string       `json:"seller_name"`
	LastMessage  *string      `json:"last_message"`
	LastAt       sql.NullTime `json:"last_at"`
	UpdatedAt    sql.NullTime `json:"updated_at"`
}

// ─── Queries ─────────────────────────────────────────────────────────────────

const getOrCreateConversation = `
INSERT INTO conversations (ad_id, buyer_id, seller_id)
VALUES ($1, $2, $3)
ON CONFLICT (ad_id, buyer_id) DO UPDATE SET updated_at = NOW()
RETURNING id, ad_id, buyer_id, seller_id, created_at, updated_at
`

func (q *Queries) GetOrCreateConversation(ctx context.Context, adID, buyerID, sellerID uuid.UUID) (Conversation, error) {
	row := q.db.QueryRowContext(ctx, getOrCreateConversation, adID, buyerID, sellerID)
	var c Conversation
	err := row.Scan(&c.ID, &c.AdID, &c.BuyerID, &c.SellerID, &c.CreatedAt, &c.UpdatedAt)
	return c, err
}

const getConversationsByUser = `
SELECT
    c.id, c.ad_id, a.title AS ad_title,
    c.buyer_id,  ub.name AS buyer_name,
    c.seller_id, us.name AS seller_name,
    (SELECT content   FROM messages m WHERE m.conversation_id = c.id ORDER BY m.created_at DESC LIMIT 1) AS last_message,
    (SELECT created_at FROM messages m WHERE m.conversation_id = c.id ORDER BY m.created_at DESC LIMIT 1) AS last_at,
    c.updated_at
FROM conversations c
JOIN ads   a  ON a.id  = c.ad_id
JOIN users ub ON ub.id = c.buyer_id
JOIN users us ON us.id = c.seller_id
WHERE c.buyer_id = $1 OR c.seller_id = $1
ORDER BY c.updated_at DESC
`

func (q *Queries) GetConversationsByUser(ctx context.Context, userID uuid.UUID) ([]ConversationRow, error) {
	rows, err := q.db.QueryContext(ctx, getConversationsByUser, userID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	var items []ConversationRow
	for rows.Next() {
		var r ConversationRow
		if err := rows.Scan(
			&r.ID, &r.AdID, &r.AdTitle,
			&r.BuyerID, &r.BuyerName,
			&r.SellerID, &r.SellerName,
			&r.LastMessage, &r.LastAt,
			&r.UpdatedAt,
		); err != nil {
			return nil, err
		}
		items = append(items, r)
	}
	return items, rows.Err()
}

const getConversationByID = `
SELECT
    c.id, c.ad_id, a.title AS ad_title,
    c.buyer_id,  ub.name AS buyer_name,
    c.seller_id, us.name AS seller_name,
    NULL AS last_message, NULL::timestamp AS last_at,
    c.updated_at
FROM conversations c
JOIN ads   a  ON a.id  = c.ad_id
JOIN users ub ON ub.id = c.buyer_id
JOIN users us ON us.id = c.seller_id
WHERE c.id = $1
`

func (q *Queries) GetConversationByID(ctx context.Context, id uuid.UUID) (ConversationRow, error) {
	row := q.db.QueryRowContext(ctx, getConversationByID, id)
	var r ConversationRow
	err := row.Scan(
		&r.ID, &r.AdID, &r.AdTitle,
		&r.BuyerID, &r.BuyerName,
		&r.SellerID, &r.SellerName,
		&r.LastMessage, &r.LastAt,
		&r.UpdatedAt,
	)
	return r, err
}

const getMessagesByConversation = `
SELECT id, conversation_id, sender_id, content, created_at
FROM messages
WHERE conversation_id = $1
ORDER BY created_at ASC
LIMIT 100
`

func (q *Queries) GetMessagesByConversation(ctx context.Context, conversationID uuid.UUID) ([]Message, error) {
	rows, err := q.db.QueryContext(ctx, getMessagesByConversation, conversationID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	var items []Message
	for rows.Next() {
		var m Message
		if err := rows.Scan(&m.ID, &m.ConversationID, &m.SenderID, &m.Content, &m.CreatedAt); err != nil {
			return nil, err
		}
		items = append(items, m)
	}
	return items, rows.Err()
}

const insertMessage = `
INSERT INTO messages (conversation_id, sender_id, content)
VALUES ($1, $2, $3)
RETURNING id, conversation_id, sender_id, content, created_at
`

func (q *Queries) InsertMessage(ctx context.Context, conversationID, senderID uuid.UUID, content string) (Message, error) {
	row := q.db.QueryRowContext(ctx, insertMessage, conversationID, senderID, content)
	var m Message
	err := row.Scan(&m.ID, &m.ConversationID, &m.SenderID, &m.Content, &m.CreatedAt)
	return m, err
}

const touchConversation = `
UPDATE conversations SET updated_at = $2 WHERE id = $1
`

func (q *Queries) TouchConversation(ctx context.Context, id uuid.UUID, t time.Time) error {
	_, err := q.db.ExecContext(ctx, touchConversation, id, t)
	return err
}
