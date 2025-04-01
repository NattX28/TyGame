"use client";
import { useState } from "react";
import Search from "../components/Search";
import RoomComponant from "../components/RoomComponant";
import MessageComponant from "../components/MessageComponant";
import InputMessage from "../components/InputMessage";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { getChatRoomImage } from "@/services/chat/chat";
import { useParams } from "next/navigation";
import { useChat } from "@/hooks/useChat";
import { useRouter } from "next/navigation";
import { getUserImage } from "@/services/user/user";

const page = () => {
  const [SearchText, setSearchText] = useState<string>("");
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const params = useParams();
  const router = useRouter();
  const roomid = (params && params.roomId) || undefined;

  const { messages, sendMessage, changeRoom, Rooms, focusRoom, setFocusRoom } = useChat(roomid);

  return (
    <div className="h-screen w-screen flex flex-row bg-black">
      <div className="h-full w-[400px] hidden md:flex md:flex-col gap-4 py-4 border-r border-second">
        <div className="px-8 pt-4 flex text-center">
          <button
            onClick={() => {
              const lastCommunity = localStorage.getItem("lastCommunity");
              const feedURL = lastCommunity ? `/feed/${lastCommunity}` : "/explore";
              router.push(feedURL)
            }}
            className="flex items-center gap-2 hover:bg-second/20 p-2 rounded-full">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-house-icon lucide-house"><path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8"/><path d="M3 10a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></svg>
          </button>
          <span className="ml-4 mt-1 text-2xl font-bold tracking-widest">CHAT</span>
        </div>
        <Search setSearchText={setSearchText} />
        <div className="h-full w-full overflow-y-auto scrollbar-transparent">
        {
          Rooms === null ? (
            <p>Loading...</p>
          ) : Rooms.length === 0 ? (
            <p>No recent rooms found.</p>
          ) : (
            Rooms.filter((room) => room.room_name.toLowerCase().startsWith(SearchText.toLowerCase())).map((room) => 
              <RoomComponant key={room.room_id} messages={messages} room={room} onRoomSelect={()=>{
                changeRoom(room.room_id);
                setFocusRoom(room);
                console.log("Set focus to", room);
              }} />
            )
          )
        }
        </div>
      </div>
      {focusRoom != null ? (
        <div className="flex-1 flex flex-col">
          <div className="h-20 p-4 border-b border-second flex flex-row items-center">
            <Avatar className="w-8 h-8 md:w-10 md:h-10 rounded-full mr-4">
              <AvatarImage className="rounded-full" src={focusRoom.is_group ? getChatRoomImage(focusRoom.image_room) : getUserImage(focusRoom.user?.id || "")} alt="Community Avatar" />
              <AvatarFallback className="flex items-center justify-center w-full h-full bg-gray-500 rounded-full">
                {focusRoom.room_name.slice(0, 1)}
              </AvatarFallback>
            </Avatar>
            <p className="pl-4">{focusRoom.room_name}</p>
            {/* <div className="ml-auto">
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
            </div> */}
          </div>
          <div className="flex-1 flex flex-col overflow-hidden">
            <div className="mt-2 flex-1 flex flex-col-reverse overflow-y-auto p-2 scroll-smooth whitespace-normal">
              {messages[focusRoom.room_id]?.map((msg) => (
                <MessageComponant key={msg.id} userID={user.userid} message={msg} />
              ))}
            </div>  
          </div>
          <InputMessage focusRoom={focusRoom} sendMessage={sendMessage} />
        </div>
      ) : (
        <h1 className="m-auto text-2xl">Select a Room to Chat</h1>
      )}
    </div>
  );
};

export default page;
