import { Community } from "@/types/types";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { Pencil } from "lucide-react";
import Link from "next/link";

const AdminCommunityCard = ({ community }: { community: Community }) => {
  return (
    <Link href={`communities/${community.commuID}`}>
      <div className="flex justify-between items-center bg-second p-3 m-2 rounded-md sm:w-36 md:w-auto">
        <Avatar className="w-4 h-4 md:w-8 md:h-8">
          <AvatarImage src={community.image} alt="Community Avatar" />
          <AvatarFallback>GC</AvatarFallback>
        </Avatar>
        <div className="flex flex-col text-main-color">
          <h4 className="">{community.name}</h4>
          <p className="">{community.members?.toLocaleString()} members</p>
        </div>
        <Pencil className="w-4 h-4" />
      </div>
    </Link>
  );
};
export default AdminCommunityCard;
