import moment from 'moment';
import { Button } from "../ui/button";
import Image from "next/image";
import { MessageCircle, ThumbsUp } from "lucide-react";
import { Community, Post, User } from "@/types/types";
import { getUserData, getUserImage } from "@/services/user/user";
import { deletePost, getPostImage, likePost, unlikePost } from "@/services/post/post";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription
} from "../ui/card";
import { useEffect, useState } from "react";
import { Avatar, AvatarImage, AvatarFallback } from "../ui/avatar";
import { getCommunity } from '@/services/community/communities';
import FeedEditPostModal from './FeedEditPostModal';

const PostCard = (
  {
    userAuth,
    post,
    setPostFocus,
    setPostAuthor,
    handleEditUpdate,
    showCommu = false,
    destroyPost,
  } : {
    userAuth: {
      userid: string;
      username: string;
      name: string;
      role: "Super Admin" | "Admin" | "User";
      exp: number;
    };
    post: Post;
    setPostFocus: React.Dispatch<React.SetStateAction<Post | undefined>>;
    setPostAuthor: React.Dispatch<React.SetStateAction<User | undefined>>;
    handleEditUpdate: (content: string, image: string) => void;
    showCommu?: boolean;
    destroyPost: () => void;
  }) => {
  const [userData, setUserData] = useState<User>();
  const [timeAgo, setTimeAgo] = useState<string>();
  const [community, setCommunity] = useState<Community>();
  const [optionsVisible, setOptionsVisible] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const [imageLoaded, setImageLoaded] = useState<boolean>(false);
  const [liked, setLiked] = useState<boolean>(post.liked);
  const [likes, setLikes] = useState<number>(post.likes || 0);

  useEffect(() => {
    if (!userData) {
      const fetchUserData = async () => {
        try {
          const data = await getUserData(post.user_id);
          setUserData(data);
        } catch (err) {
          console.log(err);
        }
      };
      fetchUserData();
    }

    const fetchCommu = async () => {
      if (post.community_id) {
        try {
          const commu = await getCommunity(post.community_id);
          setCommunity(commu);
        } catch (error) {
          console.error("Failed to fetch community", error);
        }
      }
    };
    fetchCommu();
  }, [post]);

  const handlerLike = async () => {
    try {
      if (likes !== undefined) {
        liked ? await unlikePost(post.uuid) : await likePost(post.uuid);
        setLiked(!liked);
        setLikes(likes - (liked ? 1 : -1));
      }
    } catch (err) {
      console.log(err);
    }
  }

  useEffect(() => {
    const updateTime = () => {
      const timeMs = post.timestamp;
      setTimeAgo(moment.unix(timeMs).fromNow());
    };
    updateTime();
    const intervalId = setInterval(updateTime, 1000);
    return () => clearInterval(intervalId);
  }, [post.timestamp]);

  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  const toggleOptions = () => {
    setOptionsVisible((prev) => !prev);
  };

  const handleDeleteComment = async () => {
    try {
      await deletePost(post.uuid);
      destroyPost();
    } catch (error) {
      console.error("Failed to delete comment", error);
    }
  }

  const handleEditPost = () => {
    setIsEditModalOpen(true);
  };

  return (
    <>
      { userData && (
        <Card className="w-full px-0 mx-0 bg-main text-main-color">
          <CardHeader className="p-4 flex flex-row items-center space-y-0 gap-3">
            <Avatar className="h-10 w-10">
              <AvatarImage src={getUserImage(post.user_id)} alt={post.user_id} />
              <AvatarFallback>{userData.name.slice(0, 2)}</AvatarFallback>
            </Avatar>
            <div className="flex-1 flex flex-col">
              {
                showCommu ? (
                  <>
                    <CardTitle className="text-base tracking-wide font-normal">
                      {community && community.name}
                      <span className="text-sm text-gray-400">{` • ${timeAgo}`}</span>
                    </CardTitle>
                    <CardDescription className="text-sm text-white">{`${userData.name}`}</CardDescription>
                  </>
                ) : (
                  <>
                    <CardTitle className="text-base">{userData.name}</CardTitle>
                    <CardDescription className="text-sm">{timeAgo}</CardDescription>
                  </>
                )
              }
            </div>
            <div>
              {userAuth && (userAuth.userid == post.user_id || userAuth.role == "Admin" || userAuth.role == "Super Admin") && (
                <button 
                  className={`relative ml-4 transition-opacity`}
                  onClick={toggleOptions}
                >
                  <svg aria-label="More options" className="x1lliihq x1n2onr6 x5n08af" fill="currentColor" height="24" role="img" viewBox="0 0 24 24" width="24" data-darkreader-inline-fill="">
                    <title>More options</title>
                    <circle cx="12" cy="12" r="1.5"></circle>
                    <circle cx="6" cy="12" r="1.5"></circle>
                    <circle cx="18" cy="12" r="1.5"></circle>
                  </svg>
                  {optionsVisible && (
                    <div className="absolute bg-second border rounded shadow-lg mt-2 right-0 z-10">
                      <ul className="text-sm text-white">
                        {userAuth && (userAuth.userid == post.user_id) && (
                          <li className="px-4 py-2 hover:bg-gray-400 hover:text-second-color cursor-pointer"
                            onClick={handleEditPost}
                          >
                            Edit
                          </li>
                        )}
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
          </CardHeader>
          <CardContent className="p-0">
            {post.content && (
              <div className="px-4">
                <p>{post.content}</p>
              </div>
            )}
            {post.image && (
              <div className="mt-4 relative w-full aspect-[16/9]">
                {!imageLoaded && (
                  <div className="absolute inset-0 w-full h-full flex items-center justify-center bg-second animate-pulse">
                    <svg className="w-10 h-10 text-gray-600" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 18">
                      <path d="M18 0H2a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2Zm-5.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Zm4.376 10.481A1 1 0 0 1 16 15H4a1 1 0 0 1-.895-1.447l3.5-7A1 1 0 0 1 7.468 6a.965.965 0 0 1 .9.5l2.775 4.757 1.546-1.887a1 1 0 0 1 1.618.1l2.541 4a1 1 0 0 1 .028 1.011Z"/>
                    </svg>
                    <span className="sr-only">Loading...</span>
                  </div>
                )}
                <Image
                  src={getPostImage(post.image)}
                  alt={post.uuid}
                  fill
                  className={`object-cover transition-opacity duration-300 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
                  onLoad={handleImageLoad}
                />
              </div>
            )}
          </CardContent>
          <CardFooter className="p-2 flex gap-4">
            <Button onClick={handlerLike} className={`flex items-center gap-1 ${liked ? '' : 'bg-transparent'}`}>
              <ThumbsUp className="w-5 h-5" />
              <span>Like {likes}</span>
            </Button>
            <Button
              onClick={() => {
                setPostFocus(post);
                setPostAuthor(userData);
              }}
              className="flex items-center gap-1 bg-transparent"
            >
              <MessageCircle className="w-5 h-5" />
              <span>Comment {post.comments}</span>
            </Button>
          </CardFooter>
        </Card>
      )}
      <FeedEditPostModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        post={post}
        handleEditUpdate={handleEditUpdate}
        initialContent={post.content}
        initialVisibility={post.visibility || "Public"}
      />
    </>
  );
};

export default PostCard;