import { useEffect, useRef, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Message } from "@/types/types"
interface ChatProps {
  messages: Message[];
  sendMessage: (message: Message) => void;
  isConnected: boolean; // เพิ่ม prop นี้
}

const Chat = ({ messages, sendMessage,isConnected }: ChatProps) => {
  const [message, setMessage] = useState("");
  const { user } = useAuth();
  const userID = user.userid;
  const userName = user.username;

  const messagesEnd = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    if (messagesEnd.current) {
      messagesEnd.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Enter") {
        handleSendMessage();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [message]);

  const handleSendMessage = () => {
    if (!isConnected) {
      console.log("Cannot send message - WebSocket not connected");
      return;
    }
    
    if (message.trim() !== "") {
      sendMessage({ 
        type: "message", 
        senderID: userID, 
        content: message, 
        senderName: userName 
      });
      setMessage("");
    }
  };

  return (
    <div className="flex flex-col p-4 bg-white/5 text-white rounded-lg">
      <div className="flex flex-col space-y-2 mb-4 h-64 overflow-y-auto">
        {messages.map((msg, index) => (
          <div key={index} className="flex flex-row">
            <p className="font-bold mr-2 ">{msg.senderID === userID ? "You:" : `${msg.senderName}:`}</p>
            <span>{msg.content}</span>
            {/* <span>{msg}</span> */}
          </div>
        ))}
        <div ref={messagesEnd} className="h-1" />
      </div>

      <div className="flex items-center space-x-2 pt-2">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="flex-1 p-2 bg-white border rounded-md focus:outline-none text-black min-w-5"
          placeholder="Type a message..."
          disabled={!isConnected}
        />
        <button
          onClick={handleSendMessage}
          disabled={!isConnected}
          className={`px-4 py-2 rounded-md ${
            isConnected 
              ? "chat-bg hover:bg-blue-700" 
              : "bg-gray-500 cursor-not-allowed"
          }`}>
          Send
        </button>
      </div>
      {!isConnected && (
        <div className="text-red-500 text-sm mt-2 text-center">
          Disconnected - Please refresh the page
        </div>
      )}
    </div>
  );
};

export default Chat;
