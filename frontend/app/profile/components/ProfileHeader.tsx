import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import ProfileActions from "./ProfileActions";
import { ProfileStats } from "./ProfileStats";
import ProfileBio from "./ProfileBio";
import { User } from "@/types/types";

const ProfileHeader = ({
  profile,
  isOwnProfile,
  isFollowing = false,
}: {
  profile: User;
  isOwnProfile: boolean;
  isFollowing?: boolean;
}) => {
  return (
    <div className="flex items-start gap-24 mb-8 px-8">
      {/* Avatar */}
      <Avatar className="h-48 w-48 ">
        <AvatarImage
          src={profile.imageName || "https://github.com/shadcn.png"}
          alt={profile.username}
          className="rounded-full"
        />
         <AvatarFallback className="rounded-lg">
          {profile.username.substring(0, 2).toUpperCase()}
        </AvatarFallback>
      </Avatar>

      {/* profile info */}
      <div className="flex-1 space-y-6">
        <ProfileActions
          username={profile.username}
          isOwnProfile={isOwnProfile}
          isFollowing={isFollowing}
        />
        <ProfileStats posts={profile.posts} friends={profile.friends} />
        <ProfileBio fullName={profile.fullName} bio={profile.bio} />
      </div>
    </div>
  );
};

export default ProfileHeader;
