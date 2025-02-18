package websocket

import "github.com/google/uuid"

type MessageType string

const (
    TypeUserJoined   MessageType = "USER_JOINED"
    TypeUserLeft     MessageType = "USER_LEFT"
    TypePartyUpdate  MessageType = "PARTY_UPDATE"
    TypeChatMessage  MessageType = "CHAT_MESSAGE"
)

type WebSocketMessage struct {
    Type      MessageType     `json:"type"`
    PartyID   uint           `json:"party_id"`
    UserID    uuid.UUID      `json:"user_id,omitempty"`
    Content   interface{}    `json:"content"`
}

type PartyUpdateData struct {
    CurrentMembers int      `json:"current_members"`
    MaxSlots      int      `json:"max_slots"`
    Members       []Member `json:"members"`
}

type Member struct {
    UserID    uuid.UUID `json:"user_id"`
    JoinedAt  string    `json:"joined_at"`
}