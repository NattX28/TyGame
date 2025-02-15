package websocket

import (

	"github.com/gofiber/contrib/websocket"
)

type Client struct {
	Conn *websocket.Conn
	Send chan []byte
}

func ServeWs(hub *Hub, c *websocket.Conn) {
	client := &Client{Conn: c, Send: make(chan []byte, 256)}
	hub.Register <- client

	go client.writePump()
	go client.readPump(hub)
}

// writePump ส่งข้อความจาก channel ไปยัง client
func (c *Client) writePump() {
	for {
		select {
		case message, ok := <-c.Send:
			if !ok {
				// ถ้า channel ปิดออกจาก loop
				c.Conn.WriteMessage(websocket.CloseMessage, []byte{})
				return
			}

			// ส่งข้อความไปยัง client
			err := c.Conn.WriteMessage(websocket.TextMessage, message)
			if err != nil {
				return
			}
		}
	}
}

// readPump อ่านข้อความจาก client และส่งไปที่ Hub
func (c *Client) readPump(hub *Hub) {
	defer func() {
		hub.Unregister <- c
		c.Conn.Close()
	}()

	for {
		_, message, err := c.Conn.ReadMessage()
		if err != nil {
			return
		}

		// ส่งข้อความที่อ่านได้ไปยัง Hub
		hub.Broadcast <- message
	}
}