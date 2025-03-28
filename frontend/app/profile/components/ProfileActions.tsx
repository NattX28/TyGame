"use client";
import { Button } from "@/components/ui/button";
import { checkfriend, followfriends, unfollowFriend } from "@/services/user/friends";
import { User } from "@/types/types";
import {
  UserRoundPlus,
  UserRoundMinus,
  Settings,
  MessageSquare,
} from "lucide-react";
import { useEffect, useState } from "react";

const ProfileActions = ({
  profile,
  isOwnProfile,
  friendCount,
  setFriendCount,
}: {
  profile: User;
  isOwnProfile: boolean;
  friendCount: number;
  setFriendCount: React.Dispatch<React.SetStateAction<number>>;
}) => {
  const [isFollowing, setIsFollowing] = useState(false);

  async function handleFollow() {
    try {
      if (isFollowing) {
        await unfollowFriend(profile.id);
        setFriendCount(friendCount - 1);
      } else {
        await followfriends(profile.id);
        setFriendCount(friendCount + 1);
      }
      setIsFollowing(!isFollowing);
    } catch (err) {
      console.log(err);
    }
  }

  useEffect(() => {
    const fetchFollowingStatus = async () => {
      try {
        const isFriend = await checkfriend(profile.id);
        setIsFollowing(isFriend);
      } catch (error) {
        console.log("failed to fetch following status");
      }
    };
    fetchFollowingStatus();
  }, []);

  // สำหรับโปรไฟล์ของตัวเอง ให้แสดงปุ่ม Edit Profile
  if (isOwnProfile) {
    return (
      <div className="flex items-center gap-6">
        <h1 className="text-xl font-semibold"> {profile.name} </h1>
        <Button className="rounded-md" size={"sm"}>
          <Settings className="mr-2 h-4 w-4" />
          Edit Profile
        </Button>
      </div>
    );
  }


  // สำหรับโปรไฟล์ของผู้อื่น แสดงปุ่ม Follow/Unfollow และ Message
  return (
    <div className="flex items-center gap-6">
      <div>
        <h1 className="text-xl font-semibold">{profile.name}</h1>
        <h2 className="text-white/50">{profile.username}</h2>
      </div>
      <div className="flex gap-2">
        <Button
          className="rounded-md"
          size={"sm"}
          onClick={handleFollow}
          variant={isFollowing ? "destructive" : "default"}>
          {isFollowing ? (
            <UserRoundMinus className="mr-2 h-4 w-4" />
          ) : (
            <UserRoundPlus className="mr-2 h-4 w-4" />
          )}
          {isFollowing ? "Unfollow" : "Follow"}
        </Button>
        <Button className="rounded-md" size={"sm"}>
          <MessageSquare className="mr-2 h-4 w-4" />
          Message
        </Button>
      </div>
    </div>
  );
};

export default ProfileActions;
