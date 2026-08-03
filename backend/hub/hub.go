package hub

import (
	"encoding/json"
	"log"
	"sync"
	"time"

	"github.com/google/uuid"
	"github.com/gorilla/websocket"
)

const (
	writeWait  = 10 * time.Second
	pongWait   = 60 * time.Second
	pingPeriod = (pongWait * 9) / 10
	maxMsgSize = 4096
)

// WSMessage is the JSON shape sent over the wire.
type WSMessage struct {
	ID             string `json:"id"`
	ConversationID string `json:"conversation_id"`
	SenderID       string `json:"sender_id"`
	SenderName     string `json:"sender_name"`
	Content        string `json:"content"`
	CreatedAt      string `json:"created_at"`
}

// MessageHandler is called when a message arrives so the caller can persist it.
type MessageHandler func(conversationID, senderID uuid.UUID, senderName, content string) (WSMessage, error)

// ─── Client ───────────────────────────────────────────────────────────────────

type Client struct {
	hub            *Hub
	conn           *websocket.Conn
	send           chan []byte
	UserID         uuid.UUID
	UserName       string
	ConversationID uuid.UUID
}

func (c *Client) readPump() {
	defer func() {
		c.hub.unregister <- c
		c.conn.Close()
	}()
	c.conn.SetReadLimit(maxMsgSize)
	c.conn.SetReadDeadline(time.Now().Add(pongWait))
	c.conn.SetPongHandler(func(string) error {
		c.conn.SetReadDeadline(time.Now().Add(pongWait))
		return nil
	})
	for {
		_, raw, err := c.conn.ReadMessage()
		if err != nil {
			break
		}
		var in struct {
			Content string `json:"content"`
		}
		if err := json.Unmarshal(raw, &in); err != nil || in.Content == "" {
			continue
		}
		c.hub.inbound <- inboundMsg{client: c, content: in.Content}
	}
}

func (c *Client) writePump() {
	ticker := time.NewTicker(pingPeriod)
	defer func() {
		ticker.Stop()
		c.conn.Close()
	}()
	for {
		select {
		case msg, ok := <-c.send:
			c.conn.SetWriteDeadline(time.Now().Add(writeWait))
			if !ok {
				c.conn.WriteMessage(websocket.CloseMessage, []byte{})
				return
			}
			if err := c.conn.WriteMessage(websocket.TextMessage, msg); err != nil {
				return
			}
		case <-ticker.C:
			c.conn.SetWriteDeadline(time.Now().Add(writeWait))
			if err := c.conn.WriteMessage(websocket.PingMessage, nil); err != nil {
				return
			}
		}
	}
}

// ─── Hub ──────────────────────────────────────────────────────────────────────

type inboundMsg struct {
	client  *Client
	content string
}

type Hub struct {
	mu         sync.RWMutex
	rooms      map[uuid.UUID]map[*Client]bool
	register   chan *Client
	unregister chan *Client
	inbound    chan inboundMsg
	OnMessage  MessageHandler
}

func New() *Hub {
	return &Hub{
		rooms:      make(map[uuid.UUID]map[*Client]bool),
		register:   make(chan *Client, 64),
		unregister: make(chan *Client, 64),
		inbound:    make(chan inboundMsg, 256),
	}
}

func (h *Hub) Run() {
	for {
		select {
		case c := <-h.register:
			h.mu.Lock()
			if h.rooms[c.ConversationID] == nil {
				h.rooms[c.ConversationID] = make(map[*Client]bool)
			}
			h.rooms[c.ConversationID][c] = true
			h.mu.Unlock()

		case c := <-h.unregister:
			h.mu.Lock()
			if room, ok := h.rooms[c.ConversationID]; ok {
				if _, ok := room[c]; ok {
					delete(room, c)
					close(c.send)
					if len(room) == 0 {
						delete(h.rooms, c.ConversationID)
					}
				}
			}
			h.mu.Unlock()

		case msg := <-h.inbound:
			if h.OnMessage == nil {
				continue
			}
			wsMsg, err := h.OnMessage(msg.client.ConversationID, msg.client.UserID, msg.client.UserName, msg.content)
			if err != nil {
				log.Println("hub: persist error:", err)
				continue
			}
			payload, _ := json.Marshal(wsMsg)
			h.mu.RLock()
			for c := range h.rooms[msg.client.ConversationID] {
				select {
				case c.send <- payload:
				default:
					close(c.send)
					delete(h.rooms[msg.client.ConversationID], c)
				}
			}
			h.mu.RUnlock()
		}
	}
}

// AddClient registers a connected WebSocket connection as a client.
func (h *Hub) AddClient(conn *websocket.Conn, userID uuid.UUID, userName string, convID uuid.UUID) {
	c := &Client{
		hub:            h,
		conn:           conn,
		send:           make(chan []byte, 256),
		UserID:         userID,
		UserName:       userName,
		ConversationID: convID,
	}
	h.register <- c
	go c.writePump()
	go c.readPump()
}
