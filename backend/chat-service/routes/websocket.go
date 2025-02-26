package routes

import (
	"log"
	"sync"

	"chat-service/models"
	"chat-service/handler"

	"github.com/google/uuid"
	"github.com/gofiber/contrib/websocket"
)

// Store clients in a thread-safe map with a read/write mutex
var (
	clients = make(map[uuid.UUID]*models.Client)
	mu      sync.RWMutex
)

// Function to send messages to all WebSocket connections
func writeMessages(client *models.Client) {
	for form := range client.Send { // Receive messages from the channel
		mu.RLock() // Allow multiple readers
		for i := 0; i < len(client.Conn); i++ {
			conn := client.Conn[i]
			err := conn.WriteJSON(form)
			if err != nil {
				log.Println("Write error:", err)
				conn.Close() // Close the faulty connection

				// Remove closed connection safely
				mu.RUnlock() // Release read lock before modifying
				mu.Lock()    // Lock for writing
				client.Conn = append(client.Conn[:i], client.Conn[i+1:]...)
				mu.Unlock()  // Unlock after modification
				mu.RLock()   // Re-lock for reading
				i--          // Adjust index after removal
			}
		}
		mu.RUnlock() // Release read lock
	}
}

// WebSocket handler
func WebSocket(c *websocket.Conn) {
	userID, err := uuid.Parse(c.Locals("UserID").(string))
	if err != nil {
		log.Println("Invalid UUID:", err)
		return
	}

	// Read lock to check if the client exists
	mu.RLock()
	client, exists := clients[userID]
	mu.RUnlock()

	if !exists {
		// Upgrade to write lock to create a new client
		mu.Lock()
		client = &models.Client{
			UserID: userID,
			Conn:   []*websocket.Conn{},
			Send:   make(chan models.Form),
		}
		clients[userID] = client
		mu.Unlock()
	}

	// Write lock to modify client connections
	mu.Lock()
	client.Conn = append(client.Conn, c)
	mu.Unlock()

	log.Println("New connection for user:", userID)

	// Start message writer
	go writeMessages(client)

	for {
		var form models.Form
		err := c.ReadJSON(&form)
		if err != nil {
			log.Println("Read error:", err)
			break
		}

		form.Sender = &client.UserID // Set sender ID

		switch form.Type {
		case "message":
			handler.SendMessage(client, form)
		case "event":
			log.Println("Updating friend list for:", client.UserID)
		default:
			log.Println("Unknown command:", form.Type)
		}
	}

	// Remove the closed connection
	mu.Lock()
	for i := 0; i < len(client.Conn); i++ {
		if client.Conn[i] == c {
			client.Conn = append(client.Conn[:i], client.Conn[i+1:]...)
			break
		}
	}
	if len(client.Conn) == 0 {
		delete(clients, userID) // Remove client if no connections are left
	}
	mu.Unlock()
}
