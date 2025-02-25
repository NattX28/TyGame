"use client";
import PostCard from "@/components/post/PostCard";
import { useState, useEffect } from "react";
import { getAllPost } from "@/types/response";
import { getPost } from "@/services/post/feed";

const commuID = "1";
const Feed = () => {
  const [PostFeed, setPostFeed] = useState<getAllPost>();
  useEffect(() => {
    const fetchFeed = async () => {
      try {
        const data = await getPost(commuID);
        setPostFeed(data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchFeed();
  }, []);
  console.log(PostFeed);

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
