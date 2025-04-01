import { Endpoint_Party_ws } from "@/services/api";
import { useEffect, useState } from "react";
import { Message } from "@/types/types"
import { getUserData } from "@/services/user/user";
import { User } from "lucide-react";

export const useParty = (partyId: string, userId: string) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [users, setUsers] = useState<string[]>([]);
  const [ws, setWs] = useState<WebSocket | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (!partyId || !userId) return;
    
    console.log(`[User ${userId}] Creating new WebSocket connection...`);
    
    const socket = new WebSocket(
      `${Endpoint_Party_ws}/ws/${partyId}?user_id=${userId}`
    );

    socket.onopen = () => {
      console.log(`[User ${userId}] ✅ WebSocket connected`);
      setWs(socket);
      setIsConnected(true);
      
      // ส่ง USER_JOINED ทันทีที่เชื่อมต่อสำเร็จ
      // const joinMessage = {
      //   type: "USER_JOINED",
      //   party_id: parseInt(partyId),
      //   user_id: userId
      // };
      // socket.send(JSON.stringify(joinMessage));
      console.log(`[User ${userId}] Sent join message`);
    };

    socket.onmessage = async (event) => {
      const data = JSON.parse(event.data);
      console.log(`[User ${userId}] Received message:`, data);

      try {
        const Type = data.type;
        if (Type === "message") {
          const uid = data.user_id;
          const userData = await getUserData(uid);
          const newMessage: Message = {
            type: data.type,
            senderID: uid,
            senderName: userData.username,
            content: data.content,
          };
          setMessages(prev => [...prev, newMessage]);
        } else if (Type === "USER_JOINED") {
          const uid = data.user_id;
          // const userData = await getUserData(uid);
          console.log(`[User ${userId}] User joined:`, uid);
          setUsers(prev => {
            if (!prev.includes(uid)) {
              const newUsers = [...prev, uid];
              console.log(`[User ${userId}] Updated users list:`, newUsers);
              return newUsers;
            }
            return prev;
          });
        } else if (Type === "USERS_JOINED") {
            data.user_ids.forEach((userId: string) => {
              console.log(`[User ${userId}] User joined:`, userId);
              setUsers(prev => {
                if (!prev.includes(userId)) {
                  const newUsers = [...prev, userId];
                  console.log(`[User ${userId}] Updated users list:`, newUsers);
                  return newUsers;
                }
                return prev;
              });
            })
        } else if (Type === "USER_LEFT") {
          const uid = data.user_id;
          // const userData = await getUserData(uid);
          console.log(`[User ${userId}] User left:`, uid);
          setUsers(prev => {
            const newUsers = prev.filter(id => id !== uid);
            console.log(`[User ${userId}] Updated users list:`, uid);
            return newUsers;
          });
        }
      } catch (error) {
        console.error(`[User ${userId}] Error processing message:`, error);
      }
    };

    socket.onerror = (error) => {
      console.error(`[User ${userId}] ❌ WebSocket error:`, error);
      setIsConnected(false);
    };

    socket.onclose = (event) => {
      console.log(`[User ${userId}] 🔴 WebSocket disconnected:`, {
        code: event.code,
        reason: event.reason
      });
      setIsConnected(false);
      setWs(null);
    };

    return () => {
      if (socket.readyState === WebSocket.OPEN) {
        console.log(`[User ${userId}] 🔄 Cleaning up connection...`);
        const leaveMessage = {
          type: "USER_LEFT",
          party_id: parseInt(partyId),
          user_id: userId
        };
        
        try {
          socket.send(JSON.stringify(leaveMessage));
          console.log(`[User ${userId}] Sent leave message`);
          socket.close(1000, `User ${userId} left party`);
        } catch (error) {
          console.error(`[User ${userId}] Error during cleanup:`, error);
        }
      }
    };
  }, [partyId, userId]);

  // ลบฟังก์ชัน sendMyDataToNewUesr เพราะเราส่ง USER_JOINED ใน onopen แล้ว

  const sendMessage = (message: Message) => {
    if (!ws || ws.readyState !== WebSocket.OPEN) {
      console.error(`[User ${userId}] Cannot send message - WebSocket not connected`);
      return;
    }

    try {
      const messageData = { 
        type: "message", 
        party_id: parseInt(partyId),
        user_id: userId,
        content: message.content
      };
      // console.log(`[User ${userId}] Sending message:`, messageData);
      ws.send(JSON.stringify(messageData));
    } catch (error) {
      console.error(`[User ${userId}] Error sending message:`, error);
    }
  };

  return { 
    messages, 
    sendMessage, 
    users,
    isConnected
  };
};
