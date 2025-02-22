"use client";
import { useEffect, useState } from "react";
import Profile from "./components/Profile";
import Search from "./components/Search";
import { MsgMe, MsgYou } from "./components/Message";
import InputMessage from "./components/InputMessage";
import { User } from "./../../utils/types";

const FriendList = () => {
  return (
    <>
      <Profile
        person={{ name: "John Doe", avatar: "/media/images/first.jpg" }}
      />
      <Profile
        person={{ name: "John Doe", avatar: "/media/images/first.jpg" }}
      />
      <Profile
        person={{ name: "John Doe", avatar: "/media/images/first.jpg" }}
      />
      <Profile
        person={{ name: "John Doe", avatar: "/media/images/first.jpg" }}
      />
      <Profile
        person={{ name: "John Doe", avatar: "/media/images/first.jpg" }}
      />
      <Profile
        person={{ name: "John Doe", avatar: "/media/images/first.jpg" }}
      />
      <Profile
        person={{ name: "John Doe", avatar: "/media/images/first.jpg" }}
      />
      <Profile
        person={{ name: "John Doe", avatar: "/media/images/first.jpg" }}
      />
      <Profile
        person={{ name: "John Doe", avatar: "/media/images/first.jpg" }}
      />
      <Profile
        person={{ name: "John Doe", avatar: "/media/images/first.jpg" }}
      />
      <Profile
        person={{ name: "John Doe", avatar: "/media/images/first.jpg" }}
      />
      <Profile
        person={{ name: "John Doe", avatar: "/media/images/first.jpg" }}
      />
      <Profile
        person={{ name: "John Doe", avatar: "/media/images/first.jpg" }}
      />
      <Profile
        person={{ name: "John Doe", avatar: "/media/images/first.jpg" }}
      />
    </>
  );
};

const ChatList = () => {
  return (
    <>
      {/* <MsgMe msg={"Hello World 123456789  dwadawdad"} />
      <MsgMe msg={"Hello World <h1>adwa</h1>"} />
      
      <MsgYou msg={"Hi there!"} person={{ name: "Jane Doe", avatar: "/media/images/first.jpg" }} /> */}
      <MsgYou
        msg={
          "Hi thereaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa!"
        }
        person={{ name: "Jane Doe", avatar: "/media/images/first.jpg" }}
      />
    </>
  );
};

const page = () => {
  const [person, setPerson] = useState<User | null>(null);

  useEffect(() => {
    setPerson({
      username: "John Doe",
      avatar: "/media/images/first.jpg",
    });
  }, []);

  return (
    <div className="h-screen w-screen flex flex-row bg-black">
      <div className="h-full hidden md:flex md:flex-col gap-4 py-4 border-r border-second">
        <div className="px-8 pt-4">
          <p className="text-2xl font-bold tracking-widest">CHAT</p>
        </div>
        <Search pholder={"Search chat"} />
        <div className="h-full w-full overflow-y-auto scrollbar-transparent">
          <FriendList />
        </div>
      </div>
      {person ? (
        <div className="flex-1 flex flex-col">
          <div className="h-20 p-4 border-b border-second flex flex-row items-center">
            <img
              src={person.avatar}
              alt={person.username}
              className="rounded-full h-full"
            />
            <p className="pl-4">{person.username}</p>
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
              <ChatList />
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
