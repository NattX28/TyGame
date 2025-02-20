import { Person } from "@/types/person";
import { Avatar, AvatarImage } from "@radix-ui/react-avatar";

const Profile = ({
    person,
}: {
    person: Person;
}) => {
  return (
    <div className="py-2 px-8 flex items-center hover:bg-second transition">
        <div className="h-14 w-14 relative">
            <img
                src={person.avatar}
                alt={person.name}
                className="rounded-full"
            />
            {/* status online */}
            <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-third rounded-full"></div>
        </div>
        <div className="ml-2 mx-2">
            <p className="text-sm text-title">{person.name}</p>
            <p className="text-xs text-sub-title">{"You: D Kub · 1h"}</p>
        </div>
    </div>
  );
};
export default Profile;