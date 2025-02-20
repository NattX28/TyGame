import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { Settings } from "lucide-react";
import ProfileActions from "./ProfileActions";
import { ProfileStats } from "./ProfileStats";
import ProfileBio from "./ProfileBio";

interface ProfileData {
  username: string;
  fullName: string;
  avatar: string;
  posts: number;
  friends: number;
  bio: string;
}

interface ProfileHeaderProps {
  profile: ProfileData;
}

const ProfileHeader = ({ profile }: ProfileHeaderProps) => {
  return (
    <div className="flex items-start gap-8 mb-8">
      {/* Avatar */}
      <Avatar className="h-32 w-32 ">
        <AvatarImage
          src="https://github.com/shadcn.png"
          alt="@shadcn"
          className="rounded-full"
        />
        <AvatarFallback className="rounded-lg">CN</AvatarFallback>
      </Avatar>

      {/* profile info */}
      <div className="flex-1 space-y-4">
        <ProfileActions username={profile.username} />
        <ProfileStats posts={profile.posts} friends={profile.friends} />
        <ProfileBio fullName={profile.fullName} bio={profile.bio} />
      </div>
    </div>
  );
};

export default ProfileHeader;
