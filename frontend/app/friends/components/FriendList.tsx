"use client";
import { useState } from "react";
import FriendCard from "./FriendCard";

interface Friend {
  id: string;
  name: string;
  avatar: string;
  isOnline: boolean;
}

const mockFriends: Friend[] = [
  { id: "1", name: "John Doe", avatar: "/avatars/john.png", isOnline: true },
  { id: "2", name: "Jane Smith", avatar: "/avatars/jane.png", isOnline: false },
  { id: "3", name: "Alex Brown", avatar: "/avatars/alex.png", isOnline: true },
  {
    id: "4",
    name: "Emma Wilson",
    avatar: "/avatars/emma.png",
    isOnline: false,
  },
  {
    id: "5",
    name: "Emma Wilson",
    avatar: "/avatars/emma.png",
    isOnline: false,
  },
  {
    id: "6",
    name: "Emma Wilson",
    avatar: "/avatars/emma.png",
    isOnline: false,
  },
  {
    id: "7",
    name: "Emma Wilson",
    avatar: "/avatars/emma.png",
    isOnline: false,
  },
  {
    id: "8",
    name: "Emma Wilson",
    avatar: "/avatars/emma.png",
    isOnline: false,
  },
];

const FriendList = () => {
  const [friends, setFriends] = useState<Friend[]>(mockFriends);

  const handleUnfriend = (friendId: string) => {
    const comfirmed = confirm("Are you sure want to remove this friend?");
    if (!comfirmed) return;

    setFriends((prev) => prev.filter((friend) => friend.id !== friendId));
  };
  return (
    <div className="grid grid-cols-1  gap-4">
      {friends.length === 0 ? (
        <p className="text-center text-forth">No friends found.</p>
      ) : (
        friends.map((friend) => (
          <FriendCard
            key={friend.id}
            friend={friend}
            onUnfriend={handleUnfriend}
          />
        ))
      )}
    </div>
  );
};
export default FriendList;
