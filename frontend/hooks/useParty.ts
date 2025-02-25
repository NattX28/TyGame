import { useEffect, useState } from "react";

export const useParty = (partyId: string, userId: string) => {
  const [message, setMessage] = useState<String[]>([]);
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
      setMessage((prev) => [...prev, event.data]); // update message
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
      ws.send(message);
    } else {
      console.log("Websocket not connected");
    }
  };

  return { message, sendMessage };
};
