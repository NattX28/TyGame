import { AvatarImage } from "@radix-ui/react-avatar";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { Badge } from "../ui/badge";
import { Card, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { Community } from "@/types/types";
import { useRouter } from "next/navigation";
import { joinCommunity, getCommunityImage } from "@/services/community/communities";

const CommunityCard = ({ community }: { community: Community }) => {
  const router = useRouter();

  const handleJoin = async (id: string) => {
    try {  
      const join = await joinCommunity(community.uuid);
      router.push(`/feed/${join.ID}`);
    } catch (error) {
      router.push(`/login`);
    }
  };

  return (
    community && <Card
      className="w-full max-w-sm md:max-w-md lg:max-w-lg bg-second border-third 
                  hover:shadow-xl hover:shadow-third/30 hover:border-main hover:border-2
                  transition-all duration-300 cursor-pointer relative
                  hover:translate-y-1 group">
      {/* category on top-left */}
      <div className="absolute top-3 left-3">
        <div className="flex gap-2">
          <Badge
            variant="secondary"
            className="transition-colors duration-300 group-hover:bg-third group-hover:text-main-color z-50">
            {community.category}
          </Badge>
        </div>
      </div>

      <CardContent className="p-4">
        <div className="flex flex-col items-center justify-around space-y-4">
          {/* Community Avatar */}
          <Avatar className="w-16 h-16 md:w-20 md:h-20 transition-transform duration-300 group-hover:scale-110 group-hover:ring-2 group-hover:ring-third">
            <AvatarImage src={getCommunityImage(community.image)} alt="Community Avatar" />
            <AvatarFallback>{community.name.slice(0, 2)}</AvatarFallback>
          </Avatar>

          {/* Community Info */}
          <div className="text-center space-y-2">
            <h3 className="font-semibold text-sm md:text-lg text-main-color transition-colors duration-300 group-hover:text-third">
              {community.name}
            </h3>
            <p className="text-xs md:text-sm text-main-color line-clamp-2 transition-colors duration-300 group-hover:text-main-color/90">
              {community.description}
            </p>
          </div>

          {/* Stats */}
          <div className="flex items-center space-x-2 mb-4">
            <div className="w-4 h-4 bg-green-300 transition-transform duration-300 group-hover:bg-green-500 group-hover:scale-110 rounded-full"></div>
            <span className="text-xs text-main-color transition-colors duration-300 group-hover:text-main-color/90">
              {community.member_count.toLocaleString()} Members
            </span>
          </div>

          {/* Join Button */}
          <Button
            className="w-24 transition-all duration-300 group-hover:bg-third group-hover:text-main-color hover:scale-105"
            onClick={() => handleJoin(community.uuid)}>
            Join
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
export default CommunityCard;
