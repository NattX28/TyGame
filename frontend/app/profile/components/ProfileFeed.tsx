import PostCard from "@/components/post/PostCard";
import CreatePostTrigger from "./CreatePostTrigger";

interface ProfileData {
  username: string;
  fullName: string;
  avatar: string;
  posts: number;
  friends: number;
  bio: string;
}

interface ProfileFeedProps {
  profile: ProfileData;
}

const ProfileFeed = ({ profile }: ProfileFeedProps) => {
  return (
    <div className="space-y-6">
      {/* <CreatePostTrigger profile={profile} /> */}
      <PostCard />
      <PostCard />
      <PostCard />
      <PostCard />
      <PostCard />
      <PostCard />
    </div>
  );
};
export default ProfileFeed;
