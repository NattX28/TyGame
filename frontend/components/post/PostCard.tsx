import moment from 'moment';
import { Button } from "../ui/button";
import Image from "next/image";
import { MessageCircle } from "lucide-react";
import { ThumbsUp } from "lucide-react";
import { Post } from "@/types/types";
import { UserPublicData } from "@/types/user";
import { getUserData } from "@/services/user/user";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { useEffect, useState } from "react";

const PostCard = ({ post }: { post: Post }) => {
  const [userData, setUserData] = useState<UserPublicData>();
  const [timeAgo, setTimeAgo] = useState<string>();

  useEffect(() => {
    const fetchFeed = async () => {
      try {
        const data = await getUserData(post.user_id);;
        setUserData(data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchFeed();
  }, []);

  useEffect(() => {
    const updateTime = () => {
      const timeMs = post.timestamp * 1000;
      setTimeAgo(moment.unix(timeMs).fromNow());
    };
    updateTime();
    const intervalId = setInterval(updateTime, 1000);
    return () => clearInterval(intervalId);
  }, []);

  return (
    userData && <Card className="w-full px-0 mx-0 bg-main text-main-color">
      <CardHeader className="p-4">
        <CardTitle>{userData.name}</CardTitle>
        <CardTitle className="text-sm">{timeAgo}</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="relative w-full aspect-[16/9]">
          <Image
            src="/media/images/valorant-post.jpeg"
            alt="valorant post"
            fill
            className="object-cover rounded-md"
          />
        </div>
      </CardContent>
      <CardFooter className="p-2 flex gap-4">
        <Button className="flex items-center gap-1">
          <ThumbsUp className="w-5 h-5" />
          <span>Like {post.likes}</span>
        </Button>
        <Button className="flex items-center gap-1">
          <MessageCircle className="w-5 h-5" />
          <span>comment {post.comments}</span>
        </Button>
      </CardFooter>
    </Card>
  );
};
export default PostCard;
