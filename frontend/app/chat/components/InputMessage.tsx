"use client";
import React, { use, useEffect, useState } from "react";
import { Room } from "@/types/types";
import { Smile, Mic, Image, Heart } from "lucide-react";

const InputMessage = ({
  focusRoom,
  sendMessage,
} : {
  focusRoom: Room;
  sendMessage: (message: string) => void;
}) => {
  const [message, setMessage] = useState<string>("");

  useEffect(() => {
    setMessage("")
  }, [focusRoom]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() !== "") {
      sendMessage(message);
      setMessage("");
    }
  };

  return (
    <div className="bg-black p-1.5 m-4 rounded-full border-2 border-second flex items-center gap-2">
      {/* <button className="p-2 text-gray-400 hover:text-gray-300">
        <Smile size={20} />
      </button> */}

      <form onSubmit={handleSubmit} className="ml-4 pb-1 flex-1 h-full">
        <input
          type="text"
          placeholder={"Type a message"}
          value={message}
          onChange={(e) => {
            e.preventDefault();
            setMessage(e.target.value)
          }}
          className="w-full h-full bg-transparent text-gray-200 placeholder-gray-500 outline-none"
        />
      </form>

      <div className="flex items-center gap-2">
        {/* <button className="p-2 text-gray-400 hover:text-gray-300">
          <Mic size={20} />
        </button> */}

        {/* <button className="p-2 text-gray-400 hover:text-gray-300">
          <Image size={20} />
        </button> */}

        <button
          className="p-2 text-gray-400 hover:text-gray-300"
          onClick={(e) => {
            e.preventDefault();
            sendMessage("❤️");
          }}
        >
          <Heart size={20} />
        </button>
      </div>
    </div>
  );
};

export default InputMessage;
