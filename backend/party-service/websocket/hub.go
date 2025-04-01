package websocket

import (
	"encoding/json"
	"log"
	"party-service/db"
	"party-service/models"
	"sync"

	"github.com/google/uuid"
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
        case client := <-h.Register:
            h.addClient(client)
        case client := <-h.Unregister:
            h.removeClient(client)
        case message := <-h.Broadcast:
            var wsMessage WebSocketMessage
            if err := json.Unmarshal(message, &wsMessage); err != nil {
                continue
            }
            
            h.broadcastToParty(wsMessage.PartyID, message)
        }
    }
}

// ---------old--------
func (h *Hub) addClient(client *Client) {
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

    userIDs := []uuid.UUID{}
    h.mu.Lock()
    for _, c := range h.PartyClients[client.PartyID] {
        if c.UserID != client.UserID {
            userIDs = append(userIDs, c.UserID)
        }
    }
    h.mu.Unlock()

    msg2 := WebSocketMessage2{
        Type:       "USERS_JOINED",
        PartyID:    client.PartyID,
        UserIDS:    userIDs,
    }
    msgBytes2, _ := json.Marshal(msg2)
    client.Send <- msgBytes2
}

// -------new---------
// func (h *Hub) removeClient(client *Client) {
//     h.mu.Lock()
//     defer h.mu.Unlock()

//     if _, ok := h.Clients[client]; ok {
//         log.Printf("[Hub] Removing client %s from party %d", client.UserID, client.PartyID)
        
//         // 1. ลบ client จาก maps
//         delete(h.Clients, client)
//         close(client.Send)

//         // 2. อัพเดท PartyClients
//         newPartyClients := make([]*Client, 0)
//         for _, c := range h.PartyClients[client.PartyID] {
//             if c != client {
//                 newPartyClients = append(newPartyClients, c)
//             }
//         }

//         // 3. จัดการ broadcast และ cleanup
//         if len(newPartyClients) == 0 {
//             log.Printf("[Hub] No clients remaining in party %d, removing party", client.PartyID)
//             delete(h.PartyClients, client.PartyID)
//         } else {
//             h.PartyClients[client.PartyID] = newPartyClients
//             // ส่งข้อความแจ้งสมาชิกที่เหลือ
//             msg := WebSocketMessage{
//                 Type:    TypeUserLeft,
//                 PartyID: client.PartyID,
//                 UserID:  client.UserID,
//             }
//             msgBytes, _ := json.Marshal(msg)
//             h.broadcastToParty(client.PartyID, msgBytes)
//         }
//     }
// }

func (h *Hub) removeClient(client *Client) {
	h.mu.Lock()
	defer h.mu.Unlock() // remain

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

        // อันนี้คือส่วนที่เพิ่มเข้ามา: ลบผู้ใช้ออกจากตี้ในฐานข้อมูล
        go func(partyID uint, userID uuid.UUID) {
            // ลบสมาชิกออกจากตี้ใน database
            if err := db.DB.Where("party_id = ? AND user_id = ?", partyID, userID).Delete(&models.PartyMember{}).Error; err != nil {
                log.Printf("Error deleting user %s from party %d: %v", userID, partyID, err)
                return
            }
            log.Printf("User %s removed from party %d", userID, partyID)
            
            // เช็คจำนวนสมาชิกที่เหลือในตี้
            var count int64
            if err := db.DB.Model(&models.PartyMember{}).Where("party_id = ?", partyID).Count(&count).Error; err != nil {
                log.Printf("Error counting party members %d: %v", partyID, err)
                return
            }

            // Log the remaining member count for debugging
            log.Printf("Remaining members in party %d: %d", partyID, count)

            // ถ้าตี้ว่างไ(ม่เหลือคนแล้ว) ให้ลบตี้
            if count == 0 {
                if err := db.DB.Delete(&models.Party{}, partyID).Error; err != nil {
                    log.Printf("Error deleting empty party %d: %v", partyID, err)
                }
                return
            }

            // ถ้าตี้เต็ม ให้เปลี่ยนสถานะกลับเป็น open
            var party models.Party
            if err := db.DB.First(&party, partyID).Error; err != nil {
                log.Printf("Error browsing party %d: %v", partyID, err)
                return
            }

            if party.Status == models.PartyStatusFull {
                party.Status = models.PartyStatusOpen
                if err := db.DB.Save(&party).Error; err != nil {
                    log.Printf("Error updating party status %d: %v", partyID, err)
                }
            }
        }(client.PartyID, client.UserID)

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