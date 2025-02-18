"use client"
import { useEffect, useRef, useState } from "react";
import { Person } from "@/types/person";
import Profile from "./components/Profile";
import Search from "./components/Search";
import InputMessage from "./components/InputMessage";

const FriendList = () => {
  return (
    <>
      <Profile person={{name: "John Doe", avatar: "/media/images/first.jpg" }} />
      <Profile person={{name: "John Doe", avatar: "/media/images/first.jpg" }} />
      <Profile person={{name: "John Doe", avatar: "/media/images/first.jpg" }} />
      <Profile person={{name: "John Doe", avatar: "/media/images/first.jpg" }} />
      <Profile person={{name: "John Doe", avatar: "/media/images/first.jpg" }} />
      <Profile person={{name: "John Doe", avatar: "/media/images/first.jpg" }} />
      <Profile person={{name: "John Doe", avatar: "/media/images/first.jpg" }} />
      <Profile person={{name: "John Doe", avatar: "/media/images/first.jpg" }} />
      <Profile person={{name: "John Doe", avatar: "/media/images/first.jpg" }} />
      <Profile person={{name: "John Doe", avatar: "/media/images/first.jpg" }} />
      <Profile person={{name: "John Doe", avatar: "/media/images/first.jpg" }} />
      <Profile person={{name: "John Doe", avatar: "/media/images/first.jpg" }} />
      <Profile person={{name: "John Doe", avatar: "/media/images/first.jpg" }} />
      <Profile person={{name: "John Doe", avatar: "/media/images/first.jpg" }} />
    </>
  )
}

const page = () => {
  const chatRef = useRef<HTMLDivElement>(null);

  const [person, setPerson] = useState<Person | null>(null);

  useEffect(() => {
    setPerson({
      name: "John Doe",
      avatar: "/media/images/first.jpg"
    });
  }, []);

  return (
    <div className="h-screen flex flex-row bg-black">
      <div className="border-r border-second h-full w-full max-md:hidden max-w-sm flex flex-col gap-4 py-4">
        <div className="px-8 pt-4">
          <p className="text-2xl font-bold tracking-widest">CHAT</p> 
        </div>
        <Search pholder={"Search chat"} />
        <div className="h-full w-full overflow-y-auto scrollbar-transparent">
          <FriendList />
        </div>
      </div>
      <div className="w-full h-screen">
        {person ? (
          <div className="flex flex-col h-full">
            <div className="w-full h-20 p-4 border-b border-second flex flex-row items-center">
              <img
                src={person.avatar}
                alt={person.name}
                className="rounded-full h-full"
              />
              <p className="pl-4">{person.name}</p>
              <div className="ml-auto">
                <svg aria-label="Conversation information"  fill="currentColor" height="24" role="img" viewBox="0 0 24 24" width="24"><title>Conversation information</title><circle cx="12.001" cy="12.005" fill="none" r="10.5" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"></circle><circle cx="11.819" cy="7.709" r="1.25"></circle><line fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" x1="10.569" x2="13.432" y1="16.777" y2="16.777"></line><polyline fill="none" points="10.569 11.05 12 11.05 12 16.777" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"></polyline></svg>
              </div>
            </div>
            <div className="flex-1 flex flex-col"> {/* Modified this div */}
              <div className="flex-1 overflow-hidden">
                <div
                  ref={chatRef}
                  className="h-full flex flex-col-reverse overflow-y-auto p-2 space-y-2-reverse scroll-smooth"
                >
                  <p>
                    awdadawdaw
                  </p>
                </div>
              </div>
              <InputMessage pholder={"Type a message"} />
            </div>
          </div>
        ) : (
          <h1>Select Chat</h1>
        )}
      </div>
    </div>
  );
};

export default page;
