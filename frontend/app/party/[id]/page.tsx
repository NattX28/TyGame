"use client";
import { useParty } from "@/hooks/useParty";
import { useParams } from "next/navigation";

import Chat from "../components/Message";
import Banner from "../components/Profile";

function Main() {
  const partyID = useParams().id as string;
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  if (!user.userid) {
    return (
      <div>Fail</div>
    );
  }

  const { messages, sendMessage, users, isConnected } = useParty(partyID, user.userid);

  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex-grow" />
      <Banner users={users} />
      <div className="flex-grow" />
      <div className="mx-auto w-5/6">
        <Chat messages={messages} sendMessage={sendMessage} isConnected={isConnected}/>
      </div>
    </div>
  );
}

export default Main;
