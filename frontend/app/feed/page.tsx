import PostCard from "@/components/post/PostCard";
const Feed = () => {
  return (
    <div className="flex flex-col h-full md:p-6 max-w-3xl mx-auto w-full">
      <div className="space-y-4">
        <PostCard />
        <PostCard />
        <PostCard />
        <PostCard />
        <PostCard />
        <PostCard />
      </div>
    </div>
  );
};
export default Feed;
