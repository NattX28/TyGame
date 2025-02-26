import { useEffect, useState } from "react";

export const useParty = (partyId: string, userId: string) => {
  const [messages, setMessages] = useState<string[]>([]);
  const [users, setUsers] = useState<string[]>([]);
  const [ws, setWs] = useState<WebSocket | null>(null);

  useEffect(() => {
    if (!partyId || !userId) return;

    const socket = new WebSocket(
      `ws://${process.env.NEXT_PUBLIC_API_URL}/ws/${partyId}?user-id=${userId}`
    );

    socket.onopen = () => {
      console.log("✅ WebSocket connected");
      setWs(socket);
    };

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);

      if (data.type === "message") {
        // ข้อความใหม่
        setMessages((prev) => [...prev, data.content]);
      } else if (data.type === "user-joined") {
        // ผู้ใช้ที่เข้ามาใหม่
        setUsers((prev) => [...prev, data.username]);
      }
    };

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
  }, [partyId, userId]);

  const sendMessage = (message: string) => {
    if (ws && ws.readyState === WebSocket.OPEN) {
      const messageData = { type: "message", content: message };
      ws.send(JSON.stringify(messageData));
    } else {
      console.log("Websocket not connected");
    }
  };

  return { messages, sendMessage, users }; // คืนค่า users เพื่อแสดงผู้ใช้ในห้อง
};
