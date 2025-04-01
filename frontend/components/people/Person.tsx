import { getUserImage } from "@/services/user/user";
import { User } from "@/types/types";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import Link from "next/link";

const People = ({
  person,
  linkProfile,
}: {
  person: User;
  linkProfile: string;
}) => {
  return (
    <>
      <Link href={linkProfile}>
        <div className="flex items-center min-w-44 h-14 border-white/40 border-b px-2 relative cursor:pointer hover:bg-second transition hover:border-gray-400 rounded-full">
          {/* user image */}
          <div className="w-8 h-8 md:w-10 md:h-10 relative">
            <Avatar className="rounded-full mr-4">
              <AvatarImage className="rounded-full" src={getUserImage(person.id)} alt="User Avatar" />
              <AvatarFallback className="flex items-center justify-center w-full h-full bg-gray-500 rounded-full">
                {person.name.substring(0, 2)}
              </AvatarFallback>
            </Avatar>
          </div>
          <p className="mx-2">{person.name}</p>
        </div>
      </Link>
    </>
  );
};
export default People;
