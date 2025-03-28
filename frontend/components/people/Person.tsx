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
        <div className="flex items-center min-w-44 h-12 border-white/40 border-b px-2 relative cursor:pointer hover:bg-second transition hover:border-gray-400 rounded-full">
          {/* user image */}
          <div className="h-8 w-8 relative">
            <Avatar className="h-8 w-8 ">
              <AvatarImage
                src={getUserImage(person.id)}
                alt="@shadcn"
                className="rounded-full"
              />
              <AvatarFallback className="rounded-lg">{person.name.substring(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
          </div>
          <p className="mx-2">{person.name}</p>
        </div>
      </Link>
    </>
  );
};
export default People;
