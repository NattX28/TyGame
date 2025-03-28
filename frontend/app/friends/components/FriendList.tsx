"use client";
import { useEffect, useState } from "react";
import FriendCard from "./FriendCard";
import { getAllFriends } from "@/services/user/friends";
import { Friend } from "@/types/types";

const FriendList = () => {
  const [friends, setFriends] = useState<Friend[]>([]);
  useEffect(() => {
    const fetchFriends = async () => {
      try {
        const data = await getAllFriends();
        setFriends(data);
      } catch (error) {
        console.log("failed to fetch friends");
      }
    };
    fetchFriends();
  }, []);

  const handleUnfriend = (friendId: string) => {
    const confirmed = confirm("Are you sure you want to remove this friend?"); // Fixed typo in 'confirm'
    if (!confirmed) return;
    setFriends((prev) =>
      prev ? prev.filter((friend) => friend.userid !== friendId) : []
    );
  };

  return (
    <div className="grid grid-cols-1  gap-4">
      {friends.length === 0 ? (
        <p className="text-center text-forth">No friends found.</p>
      ) : (
        friends.map((friend: Friend) => (
          <FriendCard
            key={friend.userid}
            friend={friend}
            onUnfriend={handleUnfriend}
          />
        ))
      )}
    </div>
  );
};
export default FriendList;
