import PostCard from "@/components/post/PostCard";
import { User } from "@/types/types";

const ProfileFeed = ({ profile }: { profile: User }) => {
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
