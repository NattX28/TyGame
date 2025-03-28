"use client";
import PostCard from "@/components/post/PostCard";
import { useState, useEffect } from "react";
import { getAllPost } from "@/types/response";
import { getPost } from "@/services/post/feed";
import { useParams } from "next/navigation";
import { Post } from "@/types/types";

const Feed = () => {
  const [PostFeed, setPostFeed] = useState<Post[]>([]);
  const idCommunity = useParams().id as string;

  useEffect(() => {
    const fetchFeed = async () => {
      try {
        const data = await getPost(idCommunity);
        setPostFeed(data.posts);
        console.log("Posts : ", data.posts)
      } catch (err) {
        console.log(err);
      }
    };
    fetchFeed();
  }, []);
  console.log(PostFeed);

  useEffect(() => {
    if (idCommunity) {
      localStorage.setItem("lastCommunity", idCommunity);
    }
  }, [idCommunity]);

  return (
    <div className="flex flex-col h-full md:p-6 max-w-lg mx-auto w-full">
      <div className="space-y-4">
        {
          PostFeed.map((post, index) => (
            <PostCard key={index} post={post} />
          ))
        }
      </div>
    </div>
  );
};
export default Feed;
