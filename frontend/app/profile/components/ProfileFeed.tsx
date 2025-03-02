"use client";
import PostCard from "@/components/post/PostCard";
import { User } from "@/types/types";
import { useState, useEffect } from "react";
import { getAllPost } from "@/types/response";
import { getPost } from "@/services/post/feed";

const commuID = "1";
const ProfileFeed = ({ profile }: { profile: User }) => {
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
