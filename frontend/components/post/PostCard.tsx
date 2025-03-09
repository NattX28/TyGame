import moment from 'moment';
import { Button } from "../ui/button";
import Image from "next/image";
import { MessageCircle, ThumbsUp } from "lucide-react";
import { Post } from "@/types/types";
import { UserPublicData } from "@/types/user";
import { getUserData, getUserImage } from "@/services/user/user";
import { getPostImage, likePost, unlikePost } from "@/services/post/post";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription
} from "../ui/card";
import { use, useEffect, useState } from "react";
import { Avatar, AvatarImage, AvatarFallback } from "../ui/avatar";

const PostCard = ({ post }: { post: Post }) => {
  const [userData, setUserData] = useState<UserPublicData>();
  const [timeAgo, setTimeAgo] = useState<string>();
  const [imageLoaded, setImageLoaded] = useState<boolean>(false);
  const [liked, setLiked] = useState<boolean>(post.liked);
  const [likes, setLikes] = useState<number>(post.likes || 0);

  useEffect(() => {
    if (!userData) {
      const fetchFeed = async () => {
        try {
          const data = await getUserData(post.user_id);
          setUserData(data);
        } catch (err) {
          console.log(err);
        }
      };
      fetchFeed();
    }
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

  return (
    userData && <Card className="w-full px-0 mx-0 bg-main text-main-color">
      <CardHeader className="p-4 flex flex-row items-center space-y-0 gap-3">
        <Avatar className="h-10 w-10">
          <AvatarImage src={getUserImage(post.user_id)} alt={post.user_id} />
          <AvatarFallback>{userData.name?.[0]}</AvatarFallback>
        </Avatar>
        <div className="flex flex-col">
          <CardTitle className="text-base">{userData.name}</CardTitle>
          <CardDescription className="text-xs">{timeAgo}</CardDescription>
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
        <Button className="flex items-center gap-1 bg-transparent">
          <MessageCircle className="w-5 h-5" />
          <span>Comment {post.comments}</span>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default PostCard;