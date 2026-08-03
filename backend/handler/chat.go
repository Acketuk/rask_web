package handler

import (
	"encoding/json"
	"net/http"
	"strings"
	"time"

	"github.com/Acketuk/rask_web.git/hub"
	"github.com/Acketuk/rask_web.git/internal/auth"
	"github.com/Acketuk/rask_web.git/middleware"
	"github.com/Acketuk/rask_web.git/service"
	"github.com/go-chi/chi/v5"
	"github.com/google/uuid"
	"github.com/gorilla/websocket"
)

var upgrader = websocket.Upgrader{
	CheckOrigin:     func(r *http.Request) bool { return true },
	ReadBufferSize:  1024,
	WriteBufferSize: 1024,
}

type ChatHandler struct {
	svc       *service.ChatService
	hub       *hub.Hub
	jwtSecret string
}

func NewChatHandler(svc *service.ChatService, h *hub.Hub, jwtSecret string) *ChatHandler {
	ch := &ChatHandler{svc: svc, hub: h, jwtSecret: jwtSecret}
	h.OnMessage = ch.persistMessage
	return ch
}

// persistMessage is called by the hub when a message arrives over WebSocket.
func (h *ChatHandler) persistMessage(convID, senderID uuid.UUID, senderName, content string) (hub.WSMessage, error) {
	msg, err := h.svc.SendMessage(convID, senderID, content)
	if err != nil {
		return hub.WSMessage{}, err
	}
	t := ""
	if msg.CreatedAt.Valid {
		t = msg.CreatedAt.Time.UTC().Format(time.RFC3339)
	}
	return hub.WSMessage{
		ID:             msg.ID.String(),
		ConversationID: msg.ConversationID.String(),
		SenderID:       msg.SenderID.String(),
		SenderName:     senderName,
		Content:        msg.Content,
		CreatedAt:      t,
	}, nil
}

// POST /api/v1/conversations
func (h *ChatHandler) StartConversation(w http.ResponseWriter, r *http.Request) {
	userID, ok := middleware.GetUserID(r.Context())
	if !ok {
		RespondWithError(w, http.StatusUnauthorized, "unauthorized")
		return
	}

	var body struct {
		AdID string `json:"ad_id"`
	}
	if err := json.NewDecoder(r.Body).Decode(&body); err != nil || body.AdID == "" {
		RespondWithError(w, http.StatusBadRequest, "ad_id required")
		return
	}
	adID, err := uuid.Parse(body.AdID)
	if err != nil {
		RespondWithError(w, http.StatusBadRequest, "invalid ad_id")
		return
	}

	conv, err := h.svc.GetOrCreate(r.Context(), adID, userID)
	if err != nil {
		RespondWithError(w, http.StatusInternalServerError, "failed to start conversation")
		return
	}
	RespondWithJSON(w, http.StatusOK, conv)
}

// GET /api/v1/conversations
func (h *ChatHandler) ListConversations(w http.ResponseWriter, r *http.Request) {
	userID, ok := middleware.GetUserID(r.Context())
	if !ok {
		RespondWithError(w, http.StatusUnauthorized, "unauthorized")
		return
	}
	convs, err := h.svc.ListForUser(r.Context(), userID)
	if err != nil {
		RespondWithError(w, http.StatusInternalServerError, "failed to list conversations")
		return
	}
	if convs == nil {
		convs = []interface{}{}
	}
	RespondWithJSON(w, http.StatusOK, convs)
}

// GET /api/v1/conversations/{id}
func (h *ChatHandler) GetConversation(w http.ResponseWriter, r *http.Request) {
	userID, ok := middleware.GetUserID(r.Context())
	if !ok {
		RespondWithError(w, http.StatusUnauthorized, "unauthorized")
		return
	}
	convID, err := uuid.Parse(chi.URLParam(r, "id"))
	if err != nil {
		RespondWithError(w, http.StatusBadRequest, "invalid conversation id")
		return
	}
	data, err := h.svc.GetWithMessages(r.Context(), convID, userID)
	if err != nil {
		if strings.Contains(err.Error(), "access denied") {
			RespondWithError(w, http.StatusForbidden, "access denied")
			return
		}
		RespondWithError(w, http.StatusInternalServerError, "failed to get conversation")
		return
	}
	RespondWithJSON(w, http.StatusOK, data)
}

// GET /api/v1/ws?conversation_id=<id>&token=<jwt>
func (h *ChatHandler) ServeWS(w http.ResponseWriter, r *http.Request) {
	// Auth via query param (WS can't send headers)
	tokenStr := r.URL.Query().Get("token")
	userID, err := auth.ValidateAccessToken(tokenStr, h.jwtSecret)
	if err != nil {
		http.Error(w, "unauthorized", http.StatusUnauthorized)
		return
	}

	convID, err := uuid.Parse(r.URL.Query().Get("conversation_id"))
	if err != nil {
		http.Error(w, "invalid conversation_id", http.StatusBadRequest)
		return
	}

	// Verify user belongs to this conversation
	userName, err := h.svc.VerifyMember(r.Context(), convID, userID)
	if err != nil {
		http.Error(w, "access denied", http.StatusForbidden)
		return
	}

	conn, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		return
	}

	h.hub.AddClient(conn, userID, userName, convID)
}
