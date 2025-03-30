"use client";
import PostCard from "@/components/post/PostCard";
import { useState, useEffect } from "react";
import { getPost } from "@/services/post/feed";
import { useParams } from "next/navigation";
import { Post, User } from "@/types/types";
import { useAuth } from "@/hooks/useAuth";
import ModelComment from "@/components/post/ModelComment";

const Feed = () => {
  const [PostFocus, setPostFocus] = useState<Post | undefined>();
  const [PostAuthor, setPostAuthor] = useState<User | undefined>();
  const [PostFeed, setPostFeed] = useState<Post[]>([]);
  const idCommunity = useParams().id as string;
  const { user } = useAuth();

  useEffect(() => {
    const refreshFeed = async () => {
      try {
        const data = await getPost(idCommunity);
        setPostFeed(data.posts);
      } catch (err) {
        console.log(err);
      }
    };
    
    if (idCommunity) {
      localStorage.setItem("lastCommunity", idCommunity);
      refreshFeed()
    }
  }, [idCommunity]);

  const handleEditUpdate = (id: string, content: string, image: string) => {
    setPostFeed((prev) => prev.map((post) => {
      if (post.uuid === id) {
        post.content = content;
        post.image = image;
      }
      return post;
    }));
  };

  const updatePostComment = (postId: string, increase: boolean) => {
    setPostFeed((prev) => prev.map((post) => {
      if (post.comments && post.uuid === postId) {
        if (increase) {
          post.comments = post.comments + 1;
        } else {
          post.comments = post.comments - 1;
        }
      }
      return post;
    }));
  }
  
  const deletePost = async (postId: string) => {
    setPostFeed((prev) => prev.filter((post) => post.uuid !== postId));
  }

  return (
    <div className="flex flex-col h-full md:p-6 max-w-3xl mx-auto w-full">
      <div className="space-y-4">
        {
          PostFeed.map((post, index) => (
            <PostCard
              userAuth={user}
              key={index}
              post={post}
              showCommu={true}
              setPostFocus={setPostFocus}
              setPostAuthor={setPostAuthor}
              handleEditUpdate={(content:string, image:string)=>{
                handleEditUpdate(post.uuid, content, image)
              }}
              destroyPost={()=>{
                deletePost(post.uuid)
              }}
            />
          ))
        }
      </div>
      {PostFocus && PostAuthor && (
        <ModelComment
          PostFocus={PostFocus}
          PostAuthor={PostAuthor}
          resetData={() => {
            setPostFocus(undefined);
            setPostAuthor(undefined);
          }}
          updatePostComment={updatePostComment}
        />
      )}
    </div>
  );
};
export default Feed;
