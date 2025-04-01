"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import ProfileActions from "./ProfileActions";
import { ProfileStats } from "./ProfileStats";
import ProfileBio from "./ProfileBio";
import { User } from "@/types/types";
import { getUserImage } from "@/services/user/user";
import { useEffect, useState } from "react";
import { countfriends } from "@/services/user/friends";

const ProfileHeader = ({
  profile,
}: {
  profile: User;
}) => {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const isOwnProfile = user.userid === profile.id;
  const [CFriend, setCFriend] = useState(0);

  useEffect(() => {
    const fetchFollowingStatus = async () => {
      try {
        const numFriend = await countfriends(profile.id);
        setCFriend(numFriend);
      } catch (error) {
        console.log("failed to count friends");
      }
    };
    fetchFollowingStatus();
  }, []);

  return (
    <div className="flex items-start gap-24 mb-8 px-8">
      {/* Avatar */}
      <Avatar className="w-36 h-36 rounded-full mr-4">
        <AvatarImage className="rounded-full" src={getUserImage(profile.id)} alt="User Avatar" />
        <AvatarFallback className="flex items-center justify-center w-full h-full bg-gray-500 rounded-full text-6xl">
          {profile.username.substring(0, 2)}
        </AvatarFallback>
      </Avatar>

      {/* profile info */}
      <div className="flex-1 space-y-6">
        <ProfileActions
          MyUserId={user.userid}
          profile={profile}
          isOwnProfile={isOwnProfile}
          friendCount={CFriend}
          setFriendCount={setCFriend}
        />
        <ProfileStats posts={0} friends={CFriend} />
        <ProfileBio bio={profile.description} />
      </div>
    </div>
  );
};

export default ProfileHeader;
