"use client";
import PostCard from "@/components/post/PostCard";
import { Post, User } from "@/types/types";
import { useState, useEffect } from "react";
import { getPostBio } from "@/services/post/feed";
import { useAuth } from "@/hooks/useAuth";
import ModelComment from "@/components/post/ModelComment";

const ProfileFeed = ({ profile }: { profile: User }) => {
  const [PostFocus, setPostFocus] = useState<Post | undefined>();
  const [PostAuthor, setPostAuthor] = useState<User | undefined>();
  const [PostFeed, setPostFeed] = useState<Post[]>([]);
  const { user } = useAuth();

  useEffect(() => {
    const fetchFeed = async () => {
      try {
        const data = await getPostBio(profile.id);
        if (data.posts.length > 0) {
          setPostFeed(data.posts);
        }
      } catch (err) {
        console.log(err);
      }
    };
    fetchFeed();
  }, []);

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

  const handleEditUpdate = (id: string, content: string, image: string) => {
    setPostFeed((prev) => prev.map((post) => {
      if (post.uuid === id) {
        post.content = content;
        post.image = image;
      }
      return post;
    }));
  };

  const deletePost = async (postId: string) => {
    setPostFeed((prev) => prev.filter((post) => post.uuid !== postId));
  }

  return (
    <>
      <div className="space-y-6">
        {
          PostFeed.map((post, index) => (
            <PostCard
              key={index}
              post={post}
              userAuth={user}
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
    </>
  );
};
export default ProfileFeed;
