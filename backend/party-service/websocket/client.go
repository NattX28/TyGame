package websocket

import (
	"bytes"
	"encoding/json"
	"io"
	"log"
	"net/http"
	"time"

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
				return
			}
		}
	}
}

func (c *Client) readPump(hub *Hub) {
	defer func() {
		hub.Unregister <- c
		c.Conn.Close()
	}()

	c.Conn.SetReadDeadline(time.Now().Add(120 * time.Second))
	c.Conn.SetPongHandler(func(string) error {
		c.Conn.SetReadDeadline(time.Now().Add(120 * time.Second))
		return nil
	})

	for {
		_, message, err := c.Conn.ReadMessage()
		if err != nil {
			if websocket.IsUnexpectedCloseError(err, websocket.CloseGoingAway, websocket.CloseAbnormalClosure) {
				log.Printf("error: %v", err)
			}
			break
		}

		var wsMessage WebSocketMessage
		if err := json.Unmarshal(message, &wsMessage); err != nil {
			log.Printf("error unmarshaling message: %v", err)
			continue
		}

		wsMessage.UserID = c.UserID
		wsMessage.PartyID = c.PartyID

		// Add handling for LEAVE_PARTY message
		if wsMessage.Type == TypeLeaveParty {
			// This will trigger the HTTP handler for leaving
			go handleLeaveParty(c.UserID)
			// The rest of the cleanup will happen when the connection closes
		}

		messageBytes, _ := json.Marshal(wsMessage)
		hub.Broadcast <- messageBytes
	}
}

func handleLeaveParty(userID uuid.UUID) {
	// Create request body
	type leaveRequest struct {
		UserID string `json:"user_id"`
	}
	reqBody, err := json.Marshal(leaveRequest{
		UserID: userID.String(),
	})

	if err != nil {
		log.Printf("error marshaling leave party request: %v", err)
		return
	}

	// Get base URL (you might want to make this configurable)
	baseURL := "http://localhost:5005"

	// Create the request
	req, err := http.NewRequest("POST", baseURL+"/party/leave", bytes.NewBuffer(reqBody))
	if err != nil {
		log.Printf("error creating leave party request: %v", err)
		return
	}

	// Set headers
	req.Header.Set("Content-Type", "application/json")

	// req.Header.Set("Authorization", "Bearer " + token)

	// Send the request
	client := &http.Client{
		Timeout: 10 * time.Second,
	}

	resp, err := client.Do(req)
	if err != nil {
		log.Printf("error sending leave party request: %v", err)
		return
	}
	defer resp.Body.Close()

	// Handle response
	if resp.StatusCode != http.StatusOK {
		body, _ := io.ReadAll(resp.Body)
		log.Printf("leave party request failed with status %d: %s", resp.StatusCode, string(body))
		return
	}

	log.Printf("User %s successfully left party", userID)
}

func ServeWs(hub *Hub, c *websocket.Conn, partyID uint, userID uuid.UUID) {
	log.Printf("New WebSocket connection: Party ID: %d, User ID: %s", partyID, userID)

	client := &Client{
		Conn:    c,
		PartyID: partyID,
		UserID:  userID,
		Send:    make(chan []byte, 256),
	}

	hub.Register <- client

	// defer เพื่อให้แน่ใจว่า connection จะถูก close เมื่อจบ function
	defer func() {
		hub.Unregister <- client
		c.Close()
	}()

	go client.writePump()
	client.readPump(hub) // blocking call
}
