package websocket

import (
	"encoding/json"
	"sync"
)

type Hub struct {
    Clients       map[*Client]bool
    Broadcast     chan []byte
    Register      chan *Client
    Unregister    chan *Client
    mu            sync.Mutex
    PartyClients  map[uint][]*Client
}

func NewHub() *Hub {
    return &Hub{
        Clients:      make(map[*Client]bool),
        Broadcast:    make(chan []byte),
        Register:     make(chan *Client),
        Unregister:   make(chan *Client),
        PartyClients: make(map[uint][]*Client),
    }
}

func (h *Hub) Run() {
    for {
        select {
        case client :=  <-h.Register:
            h.mu.Lock()
            h.Clients[client] = true
            h.PartyClients[client.PartyID] = append(h.PartyClients[client.PartyID], client)
            h.mu.Unlock()

            msg := WebSocketMessage{
                Type:    TypeUserJoined,
                PartyID: client.PartyID,
                UserID:  client.UserID,
            }
            msgBytes, _ := json.Marshal(msg)
            h.broadcastToParty(client.PartyID, msgBytes)

        case client := <-h.Unregister:
            h.mu.Lock()
            if _, ok := h.Clients[client]; ok {
                delete(h.Clients, client)
                close(client.Send)
                
                partyClients := h.PartyClients[client.PartyID]
                for i, c := range partyClients {
                    if c == client {
                        h.PartyClients[client.PartyID] = append(partyClients[:i], partyClients[i+1:]...)
                        break
                    }
                }

                if len(h.PartyClients[client.PartyID]) == 0 {
                    delete(h.PartyClients, client.PartyID)
                } else {
                    msg := WebSocketMessage{
                        Type:    TypeUserLeft,
                        PartyID: client.PartyID,
                        UserID:  client.UserID,
                    }
                    msgBytes, _ := json.Marshal(msg)
                    h.broadcastToParty(client.PartyID, msgBytes)
                }
            }
            h.mu.Unlock()

        case message := <-h.Broadcast:
            var wsMessage WebSocketMessage
            if err := json.Unmarshal(message, &wsMessage); err != nil {
                continue
            }
            
            h.broadcastToParty(wsMessage.PartyID, message)
        }
    }
}

func (h *Hub) broadcastToParty(partyID uint, message []byte) {
    h.mu.Lock()
    defer h.mu.Unlock()
    
    for _, client := range h.PartyClients[partyID] {
        select {
        case client.Send <- message:
        default:
            close(client.Send)
            delete(h.Clients, client)
        }
    }
}