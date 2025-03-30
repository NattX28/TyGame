import { useState, useEffect, useRef, use } from "react";
import { Avatar, AvatarImage, AvatarFallback } from "../ui/avatar";
import { Comment as CommentType } from "@/types/types";
import { getUserImage } from "@/services/user/user";
import { DeleteComment, LikeComment, UnlikeComment } from "@/services/post/comment";
import moment from "moment";

interface User {
  userid: string;
  username: string;
  name: string;
  role: "Super Admin" | "Admin" | "User";
  exp: number;
}

const CommentContainer = ({ userAuth, comment, postId, destroy }: { userAuth: User; comment: CommentType; postId: string, destroy:()=>void }) => {
  const [liked, setLiked] = useState(comment.Liked);
  const [likeCount, setLikeCount] = useState(comment.LikeCount || 0);
  const [optionsVisible, setOptionsVisible] = useState(false); // State for dropdown visibility

  useEffect(() => {
    setLiked(comment.Liked);
    setLikeCount(comment.LikeCount || 0);
  }
  , [comment]);

  const handleLikeToggle = async () => {
    try {
      if (liked) {
        await UnlikeComment(postId, comment.ID);
        setLiked(false);
        setLikeCount((prev) => prev - 1);
      } else {
        await LikeComment(postId, comment.ID);
        setLiked(true);
        setLikeCount((prev) => prev + 1);
      }
    } catch (error) {
      console.error("Failed to toggle like", error);
    }
  };

  const handleDeleteComment = async () => {
    try {
      await DeleteComment(postId, comment.ID);
      destroy();
    } catch (error) {
      console.error("Failed to delete comment", error);
    }
  };

  const toggleOptions = () => {
    setOptionsVisible((prev) => !prev);
  };

  return (
    comment.User && (
      <div className="mb-4 group">
        <div className="flex">
          <Avatar className="h-8 w-8 mr-4">
            <AvatarImage src={getUserImage(comment.UserID)} alt={comment.UserID} />
            <AvatarFallback>{comment.User.name.slice(0, 2)}</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <span className="font-medium mr-2 tracking-wide">{comment.User.name}</span>
            <span className="font-light">{comment.Content}</span>
            <div className="text-xs h-[24px] text-gray-400 flex items-center ">
              <div>{`${moment(comment.Timestamp * 1000).fromNow()}`}</div>
              {likeCount > 0 &&
                <div className="ml-4">{`${likeCount.toString()} likes`}</div>
              }
              {userAuth && (userAuth.userid == comment.UserID || userAuth.role == "Admin" || userAuth.role == "Super Admin") && (
                <button 
                  className={`relative ml-4 opacity-0 group-hover:opacity-100 transition-opacity`}
                  onClick={toggleOptions}
                >
                  <svg
                    aria-label="Comment Options"
                    className="x1lliihq x1n2onr6 x1roi4f4"
                    fill="currentColor"
                    height="24"
                    role="img"
                    viewBox="0 0 24 24"
                    width="24"
                  >
                    <title>Comment Options</title>
                    <circle cx="12" cy="12" r="1.5"></circle>
                    <circle cx="6" cy="12" r="1.5"></circle>
                    <circle cx="18" cy="12" r="1.5"></circle>
                  </svg>
                  {optionsVisible && (
                    <div className="absolute bg-second border rounded shadow-lg mt-2 right-0 z-10">
                      <ul className="text-sm text-white">
                        <li 
                          className="px-4 py-2 hover:bg-gray-400 hover:text-second-color cursor-pointer"
                          onClick={handleDeleteComment}
                        >
                          Delete
                        </li>
                      </ul>
                    </div>
                  )}
                </button>
                )}
            </div>
          </div>
          
          <button onClick={handleLikeToggle}>
            {!liked ? (
              <svg aria-label="Like" className="x1lliihq x1n2onr6 xyb1xck" fill="currentColor" height="18" role="img" viewBox="0 0 24 24" width="18">
                <title>Like</title>
                <path d="M16.792 3.904A4.989 4.989 0 0 1 21.5 9.122c0 3.072-2.652 4.959-5.197 7.222-2.512 2.243-3.865 3.469-4.303 3.752-.477-.309-2.143-1.823-4.303-3.752C5.141 14.072 2.5 12.167 2.5 9.122a4.989 4.989 0 0 1 4.708-5.218 4.21 4.21 0 0 1 3.675 1.941c.84 1.175.98 1.763 1.12 1.763s.278-.588 1.11-1.766a4.17 4.17 0 0 1 3.679-1.938m0-2a6.04 6.04 0 0 0-4.797 2.127 6.052 6.052 0 0 0-4.787-2.127A6.985 6.985 0 0 0 .5 9.122c0 3.61 2.55 5.827 5.015 7.97.283.246.569.494.853.747l1.027.918a44.998 44.998 0 0 0 3.518 3.018 2 2 0 0 0 2.174 0 45.263 45.263 0 0 0 3.626-3.115l.922-.824c.293-.26.59-.519.885-.774 2.334-2.025 4.98-4.32 4.98-7.94a6.985 6.985 0 0 0-6.708-7.218Z"></path>
              </svg>
            ) : (
              <svg aria-label="Unlike" className="x1lliihq x1n2onr6 xxk16z8" fill="currentColor" height="18" role="img" viewBox="0 0 48 48" width="18">
                <title>Unlike</title>
                <path d="M34.6 3.1c-4.5 0-7.9 1.8-10.6 5.6-2.7-3.7-6.1-5.5-10.6-5.5C6 3.1 0 9.6 0 17.6c0 7.3 5.4 12 10.6 16.5.6.5 1.3 1.1 1.9 1.7l2.3 2c4.4 3.9 6.6 5.9 7.6 6.5.5.3 1.1.5 1.6.5s1.1-.2 1.6-.5c1-.6 2.8-2.2 7.8-6.8l2-1.8c.7-.6 1.3-1.2 2-1.7C42.7 29.6 48 25 48 17.6c0-8-6-14.5-13.4-14.5z"></path>
              </svg>
            )}
          </button>
        </div>
      </div>
    )
  );
};

export default CommentContainer;
