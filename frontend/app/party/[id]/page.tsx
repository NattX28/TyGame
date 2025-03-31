"use client";
import { useParty } from "@/hooks/useParty";
import { useParams } from "next/navigation";

import Chat from "../components/Message";
import Banner from "../components/Profile";
import { useAuth } from "@/hooks/useAuth";

function PartyRoom() {
  const partyID = useParams().id as string;
  const userID = useAuth().user.userid;

  const { messages, sendMessage, users } = useParty(partyID, userID);
  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex-grow" />
      <Banner users={users} />
      <div className="flex-grow" />
      <div className="mx-auto w-5/6">
        <Chat user={userID} messages={messages} sendMessage={sendMessage} />
      </div>
    </div>
  );
}

export default PartyRoom;
