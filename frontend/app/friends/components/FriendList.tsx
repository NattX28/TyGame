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

  if (!friends) return <div>Error cannot get friends</div>;

  const handleUnfriend = (friendId: string) => {
    const comfirmed = confirm("Are you sure want to remove this friend?");
    if (!comfirmed) return;
    setFriends((prev) =>
      prev ? prev.filter((friend) => friend.id !== friendId) : []
    );
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
