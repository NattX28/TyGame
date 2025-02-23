"use client"
import { useState,useRef,useEffect } from "react";

interface ChatMessage {
  username: string;
  content: string;
}

const initialChats: ChatMessage[] = [
  { username: "first", content: "Hello" },
  { username: "sun", content: "I'm rank silver. What's yours?" },
  { username: "teh", content: "I'm rank Silver too." },
  { username: "first", content: "Nice, are we gonna play now?"},
];

function Chat() {
  const [chats, setChats] = useState<ChatMessage[]>(initialChats);
  const [message, setMessage] = useState("");

  // AutoScroll End
  const messagesEnd = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    if (messagesEnd.current) {
        messagesEnd.current.scrollIntoView({ behavior: "smooth" });
    }
    
}, [chats]);

// Press enter to send message
useEffect(() => {
    function keyDownHandler(e: globalThis.KeyboardEvent) {
      if (e.key === "Enter") {
        e.preventDefault();
        sendMessage();
      }
    }

    document.addEventListener("keydown", keyDownHandler);
    return () => {
      document.removeEventListener("keydown", keyDownHandler);
    };
  }, [message]);


  const sendMessage = () => {
    if (message.trim() === "") return;

    const newMessage: ChatMessage = {
      username: "You",
      content: message,
    };

    setChats([...chats, newMessage]);
    setMessage(""); // Clear input field after sending
  };

  return (
    <div className="flex flex-col  p-4 bg-white/5 text-white rounded-lg">
      {/* Chat Messages */}
      <div className="flex flex-col space-y-2 mb-4 h-64 overflow-y-auto">
        {chats.map((chat, index) => (
          <div key={index} className="flex flex-row">
            <p className="font-bold mr-2 ">{chat.username}:</p>
            <span>{chat.content}</span>
          </div>
        ))}
        <div ref={messagesEnd} className="h-1" />
      </div>

      {/* Chat Input */}
      <div className="flex items-center space-x-2 pt-2">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="flex-1 p-2 bg-white border rounded-md focus:outline-none text-black min-w-5"
          placeholder="Type a message..."
        />
        <button onClick={sendMessage} className="px-4 py-2 chat-bg hover:bg-blue-700 rounded-md">
          Send
        </button>
      </div>
        
    </div>
    
  );
}

export default Chat;
