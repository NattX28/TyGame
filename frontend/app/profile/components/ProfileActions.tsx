import { Button } from "@/components/ui/button";
import {
  UserRoundPlus,
  UserRoundMinus,
  Settings,
  MessageSquare,
} from "lucide-react";

const ProfileActions = ({
  username,
  isOwnProfile,
  isFollowing = false,
}: {
  username: string;
  isOwnProfile: boolean;
  isFollowing?: boolean;
}) => {
  // สำหรับโปรไฟล์ของตัวเอง ให้แสดงปุ่ม Edit Profile
  if (isOwnProfile) {
    return (
      <div className="flex items-center gap-6">
        <h1 className="text-xl font-semibold"> {username} </h1>
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
      <h1 className="text-xl font-semibold"> {username} </h1>
      <div className="flex gap-2">
        <Button
          className="rounded-md"
          size={"sm"}
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
