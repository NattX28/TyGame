import { useEffect, useRef, useState } from "react";

interface ChatProps {
  messages: string[];
  sendMessage: (message: string) => void;
}

const Chat = ({ messages, sendMessage }: ChatProps) => {
  const [message, setMessage] = useState("");

  const messagesEnd = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    if (messagesEnd.current) {
      messagesEnd.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const handleSendMessage = () => {
    if (message.trim() !== "") {
      sendMessage(message);
      setMessage("");
    }
  };

  return (
    <div className="flex flex-col p-4 bg-white/5 text-white rounded-lg">
      <div className="flex flex-col space-y-2 mb-4 h-64 overflow-y-auto">
        {messages.map((msg, index) => (
          <div key={index} className="flex flex-row">
            <p className="font-bold mr-2 ">You:</p>
            <span>{msg}</span>
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
        />
        <button
          onClick={handleSendMessage}
          className="px-4 py-2 chat-bg hover:bg-blue-700 rounded-md">
          Send
        </button>
      </div>
    </div>
  );
};

export default Chat;
