import { Endpoint_Chat_ws } from "@/services/api";
import { getRecentRooms } from "@/services/chat/chat";
import { getUserData } from "@/services/user/user";
import { ChatMessage, Room } from "@/types/types";
import { useEffect, useState } from "react";

export const useChat = (roomId?: string) => {
  const [messages, setMessages] = useState<Record<string, ChatMessage[]>>({});
  const [Rooms, setRooms] = useState<Room[]>([]);
  const [focusRoom, setFocusRoom] = useState<Room | null>(null);

  const [ws, setWs] = useState<WebSocket | null>(null);

  const token = localStorage.getItem("token") || ""

  useEffect(() => {
    const fetchrooms = async () => {
      try {
        const response = await getRecentRooms();
        const modifiedRooms = await Promise.all(
          response.map(async (room) => {
            const userData = await getUserData(room.room_name);
            return {
              ...room,
              user: userData,
              room_name: room.is_group ? room.room_name : userData.name,
            };
          })
        );
        setRooms(modifiedRooms);
        if (roomId) {
          console.log("Find Room", roomId);
          const room = modifiedRooms.find((room) => room.room_id === roomId);
          if (room) {
            console.log("Set focus to", room);
            setFocusRoom(room);
          }
        }
      } catch (error) {
        console.error("Error fetching recent rooms:", error);
      }
    }
    fetchrooms();

    const socket = new WebSocket(
      `${Endpoint_Chat_ws}/chat/ws?token=${token}${
        roomId ? `&room_id=${roomId}` : ""
      }`
    );

    socket.onopen = () => {
      console.log("✅ WebSocket connected");
      setWs(socket);
    };

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);

      if (data.Event == "New Message") {
        // New message
        const newMessage: ChatMessage = {
          id: data.ID,
          content: data.Content,
          room_id: data.RoomID,
          sender_id: data.SenderID,
          timestamp: data.Timestamp,
        };

        setMessages((prev) => {
          const updatedMessages = {
            ...prev,
            [newMessage.room_id]: [
              newMessage,
              ...(prev[newMessage.room_id] || []),
            ],
          };
          console.log("Updated messages:", updatedMessages); // Log the updated state here
          return updatedMessages;
        });

        setRooms((prev) => {
          const roomIndex = prev.findIndex((room) => room.room_id === newMessage.room_id);
          if (roomIndex === -1) {
            // Add new room to the beginning if it doesn't exist
            const newRoom: Room = {
              room_id: newMessage.room_id,
              is_group: false, // Default value, adjust if necessary
              room_name: "Unknown", // Default value, adjust if necessary
              image_room: "", // Default value, adjust if necessary
              last_message: newMessage.content,
              timestamp: newMessage.timestamp,
            };
            return [newRoom, ...prev];
          } else {
            // Move the room to the beginning of the array
            const updatedRoom = { ...prev[roomIndex], last_message: newMessage.content, timestamp: newMessage.timestamp };
            const updatedRooms = [...prev];
            updatedRooms.splice(roomIndex, 1); // Remove the room from its current position
            return [updatedRoom, ...updatedRooms];
          }
        });
      } else if (data.type === "new-room") {
        // New room
        setRooms((prev) => [
          ...prev,
          {
            room_id: data.room_id,
            is_group: data.is_group,
            room_name: data.room_name,
            image_room: data.image_room,
            last_message: data.last_message,
            timestamp: data.timestamp,
          },
        ]);
      } else if (data.Event === "Message History") {
        // Old chat
        setMessages((prev) => ({
          ...prev,
          [data.room_id]: data.messages,
        }));
      }
    }

    socket.onerror = (error) => {
      console.error("❌ WebSocket error:", error);
    };

    socket.onclose = () => {
      console.log("🔴 WebSocket disconnected");
      setWs(null);
    };

    return () => {
      socket.close();
    };
  }, []);

  const changeRoom = (room_id: string) => {
    console.log("Message History Check");
    if (!messages[room_id]) {
      console.log("Message History Fetching");
      if (ws && ws.readyState === WebSocket.OPEN) {
        const messageData = {
          Event: "Req History Message",
          RoomID: room_id,
          Content: "1",
        };
        ws.send(JSON.stringify(messageData));
      } else {
        console.log("Websocket not connected");
      }
    }
  };

  const sendMessage = (message: string) => {
    if (!focusRoom) {
      console.log("No room selected, not sending message.");
      return;
    }
    if (!message || message.trim() === "") {
      console.log("Message is empty, not sending.");
      return;
    }
    if (ws && ws.readyState === WebSocket.OPEN) {
      const messageData = {
        Event: "Message",
        RoomID: focusRoom.room_id,
        Content: message
      };
      ws.send(JSON.stringify(messageData));
    } else {
      console.log("Websocket not connected");
    }
  };

  return { messages, sendMessage, changeRoom, Rooms, focusRoom, setFocusRoom };
};
