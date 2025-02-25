"use client";
import { useParty } from "@/hooks/useParty";
import { useParams } from "next/navigation";
import Banner from "../components/Banner";
import Chat from "../components/Chat";
import { Button } from "@/components/ui/button";
import axios from "axios";
import router from "next/router";

function PartyRoom() {
  const partyID = useParams().partyId as string;
  const userID = "user-123";

  const leaveParty = async () => {
    try {
      await axios.post("http://localhost:5005/party/leave", {
        user_id: userID,
      });
      router.push("/feed");
    } catch (error) {
      console.error("Failed to leave party:", error);
    }
  };

  const { messages, sendMessage, users } = useParty(partyID, userID);
  return (
    <div className="flex flex-col min-h-screen">
      <Button onClick={leaveParty}>Leave Party</Button>
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
