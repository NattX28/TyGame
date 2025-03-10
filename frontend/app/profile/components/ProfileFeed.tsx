"use client";
import PostCard from "@/components/post/PostCard";
import { Post, User } from "@/types/types";
import { useState, useEffect } from "react";
import { getPostBio } from "@/services/post/feed";

const ProfileFeed = ({ profile }: { profile: User }) => {
  const [PostFeed, setPostFeed] = useState<Post[]>([]);
  useEffect(() => {
    const fetchFeed = async () => {
      try {
        const data = await getPostBio(profile.id);
        setPostFeed(data.posts);
      } catch (err) {
        console.log(err);
      }
    };
    fetchFeed();
  }, []);

  return (
    <div className="space-y-6">
      {
        PostFeed.map((post, index) => (
          <PostCard key={index} post={post} />
        ))
      }
    </div>
  );
};
export default ProfileFeed;
