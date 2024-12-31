import { AvatarImage } from "@radix-ui/react-avatar";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { Badge } from "../ui/badge";
import { Card, CardContent, CardFooter, CardHeader } from "../ui/card";
import { Button } from "../ui/button";
import { CommunityCardProps } from "@/types/community";

const CommunityCard = ({ community }: { community: CommunityCardProps }) => {
  return (
    <Card className="w-72 bg-second border-third hover:shadow-lg transition-shadow duration-200 cursor-pointer relative ">
      {/* category on top-left */}
      <div className="absolute top-3 left-3">
        <div className="flex gap-2">
          <Badge variant="secondary">{community.category}</Badge>
        </div>
      </div>

      <CardContent className="p-4">
        <div className="flex flex-col items-center justify-around space-y-4">
          {/* Community Avatar */}
          <Avatar className="w-20 h-20">
            <AvatarImage src={community.image} alt="Community Avatar" />
            <AvatarFallback>GC</AvatarFallback>
          </Avatar>

          {/* Community Info */}
          <div className="text-center space-y-2">
            <h3 className="font-semibold text-lg text-main-color">
              {community.name}
            </h3>
            <p className="text-sm text-main-color line-clamp-2">
              {community.description}
            </p>
          </div>

          {/* Stats */}
          <div className="flex items-center space-x-2 mb-4">
            <div className="w-4 h-4 bg-red-400"></div>
            <span className="text-xs text-main-color">2.5k members</span>
          </div>

          {/* Join Button */}
          <Button className="w-24">Join</Button>
        </div>
      </CardContent>
    </Card>
  );
};
export default CommunityCard;
