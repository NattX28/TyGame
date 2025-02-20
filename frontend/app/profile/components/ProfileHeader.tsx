import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { Settings } from "lucide-react";
import ProfileActions from "./ProfileActions";
import { ProfileStats } from "./ProfileStats";
import ProfileBio from "./ProfileBio";
import { ProfileData } from "@/types/person";

const ProfileHeader = ({
  profile,
  btnText,
  btnIcon,
}: {
  profile: ProfileData;
  btnText: string;
  btnIcon: string;
}) => {
  return (
    <div className="flex items-start gap-24 mb-8 px-8">
      {/* Avatar */}
      <Avatar className="h-48 w-48 ">
        <AvatarImage
          src="https://github.com/shadcn.png"
          alt="@shadcn"
          className="rounded-full"
        />
        <AvatarFallback className="rounded-lg">CN</AvatarFallback>
      </Avatar>

      {/* profile info */}
      <div className="flex-1 space-y-6">
        <ProfileActions
          username={profile.username}
          btnText={btnText}
          btnIcon={btnIcon}
        />
        <ProfileStats posts={profile.posts} friends={profile.friends} />
        <ProfileBio fullName={profile.fullName} bio={profile.bio} />
      </div>
    </div>
  );
};

export default ProfileHeader;
