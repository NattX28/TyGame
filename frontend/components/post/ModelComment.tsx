"use client";
import moment from 'moment';
import { useEffect, useState } from "react";
import { Comment, Post, User } from "@/types/types";
import { X } from 'lucide-react';
import Image from "next/image";
import { createComments, getComments, getPostImage } from "@/services/post/post";
import { Avatar, AvatarImage, AvatarFallback } from "../ui/avatar";
import { getUserData, getUserImage, getUsersData } from "@/services/user/user";
import CommentContainer from "./Comment";
import { useAuth } from "@/hooks/useAuth";

const ModelComment = (({
  PostFocus,
  PostAuthor,
  resetData,
  updatePostComment,
} : {
  PostFocus: Post;
  PostAuthor: User;
  resetData: () => void;
  updatePostComment: (postId: string, increase: boolean) => void;
}) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [comment, setComment] = useState('');
  const [imageLoaded, setImageLoaded] = useState<boolean>(false);

  const { user: userAuth } = useAuth();

  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  const handleCommentChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setComment(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Comment submitted:', comment);
    try {
      const newComment = await createComments(PostFocus.uuid, comment);
      updatePostComment(PostFocus.uuid, true);
      newComment.User = await getUserData(userAuth.userid);

      const tempComment = comments
      tempComment.unshift(newComment);
      setComments(tempComment);

      console.log('New comment:', comments);

      setComment('');
    } catch (error) {
      console.error("Failed to create comment", error);
    }
  };

  const destroyComment = (commentId: string) => {
    updatePostComment(PostFocus.uuid, false);
    setComments((prevComments) => prevComments.filter((comment) => comment.ID !== commentId));
  };

  useEffect(() => {
    async function fetchComments() {
      try {
        const fetchComments = await getComments(PostFocus.uuid);
        const userIds = fetchComments.map((comment) => comment.UserID);
        if (userIds.length === 0) return;
        const userData = await getUsersData(userIds);

        fetchComments.forEach((comment) => {
          comment.PostID = PostFocus.uuid;
          if (userData[comment.UserID]) {
            comment.User = userData[comment.UserID];
          }
        });
        setComments(fetchComments);
      } catch (error) {
        console.error("Failed to fetch comments", error);
      }
    }
    if (PostFocus.uuid) {
      fetchComments();
    }
  }, [PostFocus.uuid]);

  return (
    <div className="fixed w-screen h-screen left-0 top-0 z-[9999] flex items-center justify-center bg-black bg-opacity-75">
      <div className={`flex w-[90%] ${PostFocus.image ? "max-w-6xl" : "max-w-3xl"} h-[95%] bg-black text-white`}>
        {PostFocus.image && (
          <div className="w-1/2 h-full bg-black flex items-center justify-center relative">
            <>
              {!imageLoaded && (
                <div className="max-h-full max-w-full object-contain">
                  <svg className="w-10 h-10 text-gray-600" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 18">
                    <path d="M18 0H2a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2Zm-5.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Zm4.376 10.481A1 1 0 0 1 16 15H4a1 1 0 0 1-.895-1.447l3.5-7A1 1 0 0 1 7.468 6a.965.965 0 0 1 .9.5l2.775 4.757 1.546-1.887a1 1 0 0 1 1.618.1l2.541 4a1 1 0 0 1 .028 1.011Z"/>
                  </svg>
                  <span className="sr-only">Loading...</span>
                </div>
              )}
              <Image
                src={getPostImage(PostFocus.image)}
                alt={PostFocus.uuid}
                fill
                className={`max-h-full max-w-full object-contain`}
                onLoad={handleImageLoad}
              />
            </>
          </div>
        )}
        
        {/* Right side - Comments */}
        <div className={`${PostFocus.image ? "w-1/2 border-l" : "w-full"} h-full flex flex-col border-gray-800`}>
          {/* Close button */}
          <button className="absolute top-10 right-10 text-white" onClick={resetData}>
            <X size={30} />
          </button>
          
          {/* Header */}
          <div className="p-4 border-b border-gray-800">
            <div className="flex items-center">
              <Avatar className="h-8 w-8 mr-4">
                <AvatarImage src={getUserImage(PostAuthor.id)} alt={PostAuthor.id} />
                <AvatarFallback>{PostAuthor.name.slice(0, 2)}</AvatarFallback>
              </Avatar>
              <div className="font-medium tracking-wide">{PostAuthor.name}</div>
            </div>
          </div>
          
          <div className="flex-grow overflow-y-auto p-4">
            {comments.map((comment, index) => (
              <CommentContainer key={index} userAuth={userAuth} comment={comment} postId={PostFocus.uuid} destroy={() => destroyComment(comment.ID)} />
            ))}
          </div>

          {/* Footer - New comment input */}
          <div className="p-4 border-t border-gray-800">
            <form onSubmit={handleSubmit} className="flex">
              <input
                type="text"
                placeholder="Add a comment..."
                value={comment}
                onChange={handleCommentChange}
                className="flex-grow bg-transparent outline-none"
              /> 
              <button 
                type="submit" 
                disabled={!comment.trim()} 
                className={`ml-2 font-semibold ${!comment.trim() ? 'text-blue-900' : 'text-blue-500'}`}
              >
                Post
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
});

export default ModelComment;