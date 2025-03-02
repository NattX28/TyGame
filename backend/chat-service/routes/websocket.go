package routes

import (
	"log"
	"sync"
	"time"

	"chat-service/db"
	"chat-service/models"

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
			Send:   make(chan models.FormResponse),
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

	roomID := c.Query("room_id")
	pageStr := c.Query("page", "1")
	page, err := strconv.Atoi(pageStr)
	if err != nil || page <= 0 {
		page = 1
	}

	// Send the message history when WebSocket is connected
	sendMessageHistory(c, roomID, page)

	for {
		var form models.Form
		err := c.ReadJSON(&form)
		if err != nil {
			log.Println("Read error:", err)
			break
		}

		switch form.Event {
		case "send message":
			SendMessage(client, form)
		default:
			log.Println("Unknown command:", form.Event)
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

func SendMessage(client *models.Client, form models.Form) {
	roomID, err := uuid.Parse(form.RoomID)
	if err != nil {
		log.Println("Invalid roomID:", err)
		return
	}
	
	// Get all members of the room
	var roomMembers []models.RoomMember
	if err := db.DB.Where("room_id = ?", roomID).Find(&roomMembers).Error; err != nil {
		log.Println("Error fetching room members:", err)
		return
	}
	
	// Store the message in the database (assuming you have a Message model)
	message := models.Message{
		RoomID:    roomID,
		SenderID:  client.UserID,
		Content:   form.Content,
		Timestamp: time.Now().Unix(),,
	}
	
	if err := db.DB.First(&models.Room{}, roomID).Error; err != nil {
		log.Println("Error room not found:", err)
		return
	}

	var roomMember models.RoomMember
	if err := db.DB.First(&roomMember, "room_id = ? AND user_id = ?", roomID, client.UserID).Error; err != nil {
		log.Println("Error: user is not a member of this room:", err)
		return
	}

	if err := db.DB.Create(&message).Error; err != nil {
		log.Println("Error string message:", err)
		return
	}
	
	// Create the message payload to send to all members
	messagePayload := models.FormResponse{
		Event:   "new message",
		Content: message.Content,
		RoomID:  roomID,
		SenderID:  client.UserID,
		Timestamp: message.Timestamp,
	}
	
	// Get clients map with read lock
	mu.RLock()
	defer mu.RUnlock()
	
	// Send the message to all members in the room
	for _, member := range roomMembers {
		// Skip blocked members
		if member.Block {
			continue
		}
		
		// Update last seen message ID for the sender
		if member.UserID == client.UserID {
			db.DB.Model(&models.RoomMember{}).Where("room_id = ? AND user_id = ?", roomID, member.UserID).
				Update("last_seen_message_id", message.ID)
		}
		
		// Find the client for this member
		if recipient, exists := clients[member.UserID]; exists {
			select {
				case recipient.Send <- messagePayload:
					// Message sent successfully
				default:
					// Channel is full or closed, log error
					log.Printf("Failed to send message to user %s: channel full or closed", member.UserID)
			}
		}
	}
}

func SendMessageHistory(c *websocket.Conn, roomID string, page int) {
    limit := 20 // Number of messages per page
    offset := (page - 1) * limit

    // Fetch message history for the room (pagination)
    var messages []models.Message
    err := db.DB.
        Where("room_id = ?", roomID).
        Order("timestamp DESC").
        Limit(limit).
        Offset(offset).
        Find(&messages).Error

    if err != nil {
        log.Println("Error fetching messages:", err)
        return
    }

    // Format the messages into a response
    var responseMessages []models.MessageResponse
    for _, msg := range messages {
        responseMessages = append(responseMessages, models.MessageResponse{
            ID:        msg.ID,
            SenderID:  msg.SenderID,
            Content:   msg.Content,
            Timestamp: msg.Timestamp,
        })
    }

    // Send the message history to the client
    err = c.WriteJSON(responseMessages)
    if err != nil {
        log.Println("Error sending message history:", err)
    }
}