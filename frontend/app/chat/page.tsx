"use client";
import { useEffect, useState } from "react";
import Search from "./components/Search";
import RoomList from "./components/Roomlist";
import MessageList from "./components/Messagelist";
import InputMessage from "./components/InputMessage";
import { ChatMessage, RecentRoom, ChatRoomFocus } from "@/types/types";


const page = () => {
  const [focusRoom, setFocusRoom] = useState<ChatRoomFocus | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [recentRooms, setRecentRooms] = useState<RecentRoom[] | null>(null);

  useEffect(() => {
    // Simulate receiving data from WebSocket or API
    setTimeout(() => {
      setRecentRooms([
        {
          room_id: "b1d1a6dc-9f5e-4c93-8a6e-83dcb9a6a1c1",
          is_group: false,
          room_name: "John Doe",
          last_message: "Hey, how are you?",
          timestamp: 1709295600000,
        },
        {
          room_id: "a8b1a9d2-3e7b-4c97-9a6e-12cde7f8b9f2",
          is_group: true,
          room_name: "Project Team",
          last_message: "Meeting at 3PM, don't forget.",
          timestamp: 1709300000000,
        },
        {
          room_id: "d5f3a2b4-8c6d-4e5f-9a7b-19cde8f8c9f3",
          is_group: false,
          room_name: "Jane Smith",
          last_message: "See you tomorrow!",
          timestamp: 1709312000000,
        },
        {
          room_id: "f3c5a4b7-1d6e-4e8f-9a8c-25cde9f8d9f4",
          is_group: true,
          room_name: "Family Chat",
          last_message: "Dinner at 7?",
          timestamp: 1709328000000,
        },
      ]);

      setFocusRoom({
        room_id: "b1d1a6dc-9f5e-4c93-8a6e-83dcb9a6a1c1",
        is_group: false,
        room_name: "John Doe",
      });
    }, 1000);
  }, []);

  return (
    <div className="h-screen w-screen flex flex-row bg-black">
      <div className="h-full w-[400px] hidden md:flex md:flex-col gap-4 py-4 border-r border-second">
        <div className="px-8 pt-4">
          <p className="text-2xl font-bold tracking-widest">CHAT</p>
        </div>
        <Search pholder={"Search chat"} />
        <div className="h-full w-full overflow-y-auto scrollbar-transparent">
        {
          recentRooms === null ? (
            <p>Loading...</p>
          ) : recentRooms.length === 0 ? (
            <p>No recent rooms found.</p>
          ) : (
            <RoomList recentRooms={recentRooms} />
          )
        }
        </div>
      </div>
      {focusRoom !== null ? (
        <div className="flex-1 flex flex-col">
          <div className="h-20 p-4 border-b border-second flex flex-row items-center">
            <img
              src={focusRoom.room_id}
              alt={focusRoom.room_name}
              className="rounded-full h-full"
            />
            <p className="pl-4">{focusRoom.room_name}</p>
            <div className="ml-auto">
              <svg
                aria-label="Conversation information"
                fill="currentColor"
                height="24"
                role="img"
                viewBox="0 0 24 24"
                width="24">
                <circle
                  cx="12.001"
                  cy="12.005"
                  fill="none"
                  r="10.5"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"></circle>
                <circle cx="11.819" cy="7.709" r="1.25"></circle>
                <line
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  x1="10.569"
                  x2="13.432"
                  y1="16.777"
                  y2="16.777"></line>
                <polyline
                  fill="none"
                  points="10.569 11.05 12 11.05 12 16.777"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"></polyline>
              </svg>
            </div>
          </div>
          <div className="flex-1 flex flex-col">
            <div className="flex-1 flex flex-col-reverse max-w-full overflow-y-auto p-2 scroll-smooth whitespace-normal">
              <MessageList Messages={messages} />
            </div>
            <InputMessage pholder={"Type a message"} />
          </div>
        </div>
      ) : (
        <h1>Select Chat</h1>
      )}
    </div>
  );
};

export default page;
