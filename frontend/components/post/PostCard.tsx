import { Button } from "../ui/button";
import Image from "next/image";
import { MessageCircle } from "lucide-react";
import { ThumbsUp } from "lucide-react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";

const PostCard = () => {
  return (
    <Card className="w-full px-0 mx-0 bg-main text-main-color">
      <CardHeader className="p-4">
        <CardTitle>Joney Star</CardTitle>
        <CardTitle className="text-sm">17 January 2025 16:45:31</CardTitle>
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
          <span>Like</span>
        </Button>
        <Button className="flex items-center gap-1">
          <MessageCircle className="w-5 h-5" />
          <span>comment</span>
        </Button>
      </CardFooter>
    </Card>
  );
};
export default PostCard;
