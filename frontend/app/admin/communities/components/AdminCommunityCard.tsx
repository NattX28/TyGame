import { getCommunityImage } from "@/services/community/communities";
import { Community } from "@/types/types";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { Pencil } from "lucide-react";
import Link from "next/link";


const AdminCommunityCard = ({ community }: { community: Community }) => {
  return (
    <Link href={`communities/${community.uuid}`}>
      <div
        className="flex justify-between items-center bg-second p-5 m-2 rounded-md sm:w-36 md:w-auto 
                    transition-all duration-300 hover:shadow-md hover:shadow-red-900/30
                    hover:bg-black hover:bg-opacity-80 hover:scale-102
                    hover:border-red-600 hover:border hover:cursor-pointer">
        <Avatar className="w-4 h-4 md:w-8 md:h-8">
          <AvatarImage src={getCommunityImage(community.image)} alt="Community Avatar" />
          <AvatarFallback>GC</AvatarFallback>
        </Avatar>
        <div className="flex flex-col text-main-color mx-3">
          <h4 className="transition-colors duration-300 group-hover:text-red-500">
            {community.name}
          </h4>
          <p className="transition-colors duration-300 group-hover:text-gray-400">
            {community.member_count?.toLocaleString() || 0} members
          </p>
        </div>
        <Pencil className="w-4 h-4 transition-all duration-300 hover:text-red-500 hover:scale-110" />
      </div>
    </Link>
  );
};

export default AdminCommunityCard;
