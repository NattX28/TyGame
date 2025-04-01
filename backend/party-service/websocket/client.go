package websocket

import (
	// "bytes"
	"encoding/json"
	// "io"
	"log"
	// "net/http"
	"time"
	
	"party-service/repository" // เพิ่งเพิ่ม
	"github.com/gofiber/contrib/websocket"
	"github.com/google/uuid"
)

type Client struct {
	Conn    *websocket.Conn
	PartyID uint
	UserID  uuid.UUID
	Send    chan []byte
}

func (c *Client) writePump() {
	ticker := time.NewTicker(60 * time.Second)
	defer func() {
		ticker.Stop()
		c.Conn.WriteMessage(websocket.CloseMessage, []byte{}) // ส่ง CloseMessage
    	c.Conn.Close()
	}()

	for {
		select {
		case message, ok := <-c.Send:
			if !ok {
				c.Conn.WriteMessage(websocket.CloseMessage, []byte{})
				return
			}

			err := c.Conn.WriteMessage(websocket.TextMessage, message)
			if err != nil {
				log.Printf("error writing message: %v", err)
				return
			}

		case <-ticker.C:
			if err := c.Conn.WriteMessage(websocket.PingMessage, nil); err != nil {
				log.Printf("Ping failed for User %s in Party %d: %v", c.UserID, c.PartyID, err)
				return
			}
		}
	}
}

func (c *Client) readPump(hub *Hub) {
    defer func() {
        log.Printf("[ReadPump] Client %s disconnecting from party %d", c.UserID, c.PartyID)
        handleLeaveParty(c.UserID)
        hub.Unregister <- c
        c.Conn.Close()
    }()

    for {
        _, message, err := c.Conn.ReadMessage()
        if err != nil {
            if websocket.IsUnexpectedCloseError(err, websocket.CloseGoingAway, websocket.CloseAbnormalClosure) {
                log.Printf("[ReadPump] Error reading message: %v", err)
            }
            break
        }

        var wsMessage WebSocketMessage
        if err := json.Unmarshal(message, &wsMessage); err != nil {
            log.Printf("[ReadPump] Error unmarshaling message: %v", err)
            continue
        }

        log.Printf("[ReadPump] Received message type: %s from user: %s", wsMessage.Type, c.UserID)

        wsMessage.UserID = c.UserID
        wsMessage.PartyID = c.PartyID

        if wsMessage.Type == TypeUserLeft {
            log.Printf("[ReadPump] User %s leaving party %d", c.UserID, c.PartyID)
            handleLeaveParty(c.UserID)
            messageBytes, _ := json.Marshal(wsMessage)
            hub.Broadcast <- messageBytes
            break
        }
		

        messageBytes, _ := json.Marshal(wsMessage)
        hub.Broadcast <- messageBytes
    }
}

func handleLeaveParty(userID uuid.UUID) {
    log.Printf("[HandleLeaveParty] Starting leave party process for user: %s", userID)
    
    // เปลี่ยนเป็นเรียกใช้ repository โดยตรงแทนการเรียก API
    if err := repository.LeaveParty(userID); err != nil {
        log.Printf("[HandleLeaveParty] Error leaving party: %v", err)
        return
    }
    
    log.Printf("[HandleLeaveParty] User %s successfully left party", userID)
}

// func (c *Client) readPump(hub *Hub) {
// 	defer func() {
// 		hub.Unregister <- c
// 		c.Conn.WriteMessage(websocket.CloseMessage, []byte{}) // ส่ง CloseMessage
//     	c.Conn.Close()
// 	}()

// 	c.Conn.SetReadDeadline(time.Now().Add(120 * time.Second))
// 	c.Conn.SetPongHandler(func(string) error {
// 		c.Conn.SetReadDeadline(time.Now().Add(120 * time.Second))
// 		return nil
// 	})

// 	for {
// 		_, message, err := c.Conn.ReadMessage()
// 		if err != nil {
// 			if websocket.IsUnexpectedCloseError(err, websocket.CloseGoingAway, websocket.CloseAbnormalClosure) {
// 				log.Printf("%v", err)
// 			}
// 			break
// 		}

// 		var wsMessage WebSocketMessage
// 		if err := json.Unmarshal(message, &wsMessage); err != nil {
// 			log.Printf("error unmarshaling message: %v", err)
// 			continue
// 		}

// 		wsMessage.UserID = c.UserID
// 		wsMessage.PartyID = c.PartyID

// 		// Add handling for LEAVE_PARTY message
// 		if wsMessage.Type == TypeLeaveParty {
// 			// This will trigger the HTTP handler for leaving
// 			go handleLeaveParty(c.UserID)
// 			// The rest of the cleanup will happen when the connection closes
// 		}

// 		messageBytes, _ := json.Marshal(wsMessage)
// 		hub.Broadcast <- messageBytes
// 	}
// }

// func handleLeaveParty(userID uuid.UUID) {
// 	// Create request body
// 	type leaveRequest struct {
// 		UserID string `json:"user_id"`
// 	}
// 	reqBody, err := json.Marshal(leaveRequest{
// 		UserID: userID.String(),
// 	})

// 	if err != nil {
// 		log.Printf("error marshaling leave party request: %v", err)
// 		return
// 	}

// 	// Get base URL (you might want to make this configurable)
// 	baseURL := "http://localhost:5005"

// 	// Create the request
// 	req, err := http.NewRequest("POST", baseURL+"/party/leave", bytes.NewBuffer(reqBody))
// 	if err != nil {
// 		log.Printf("error creating leave party request: %v", err)
// 		return
// 	}

// 	// Set headers
// 	req.Header.Set("Content-Type", "application/json")

// 	// req.Header.Set("Authorization", "Bearer " + token)

// 	// Send the request
// 	client := &http.Client{
// 		Timeout: 10 * time.Second,
// 	}

// 	resp, err := client.Do(req)
// 	if err != nil {
// 		log.Printf("error sending leave party request: %v", err)
// 		return
// 	}
// 	defer resp.Body.Close()

// 	// Handle response
// 	if resp.StatusCode != http.StatusOK {
// 		body, _ := io.ReadAll(resp.Body)
// 		log.Printf("leave party request failed with status %d: %s", resp.StatusCode, string(body))
// 		return
// 	}

// 	log.Printf("User %s successfully left party", userID)
// }