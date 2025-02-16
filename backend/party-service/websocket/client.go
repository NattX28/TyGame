package websocket

import (
    "encoding/json"
    "log"
    "time"
    "github.com/gofiber/contrib/websocket"
    "github.com/google/uuid"
)

type Client struct {
    Conn     *websocket.Conn
    PartyID  uint
    UserID   uuid.UUID
    Send     chan []byte
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
        
        messageBytes, _ := json.Marshal(wsMessage)
        hub.Broadcast <- messageBytes
    }
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