"use client";
import { useParty } from "@/hooks/useParty";
import { useParams } from "next/navigation";

import Chat from "../components/Chat";
import Banner from "../components/Banner";

function PartyRoom() {
  const partyID = useParams().partyId as string;
  const userID = "user-123";

  const { messages, sendMessage, users } = useParty(partyID, userID);
  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex-grow" />
      <Banner users={users} />
      <div className="flex-grow" />
      <div className="mx-auto w-5/6">
        <Chat messages={messages} sendMessage={sendMessage} />
      </div>
    </div>
  );
}

export default PartyRoom;
// 