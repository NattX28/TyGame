import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";

const Profile = ({
    friend,
}: {
    friend: { id: number; name: string; avatar: string };
}) => {
  return (
    <div className="flex items-center min-w-44 h-12 border-white border-2 rounded-3xl px-2 relative cursor:pointer hover:bg-second transition">
        <div className="h-8 w-8 relative">
            <Avatar className="h-8 w-8 ">
                <AvatarImage
                    src="https://github.com/shadcn.png"
                    alt="@shadcn"
                    className="rounded-full"
                />
                <AvatarFallback className="rounded-lg">CN</AvatarFallback>
            </Avatar>
            {/* status online */}
            <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-third rounded-full"></div>
        </div>
        <p className="mx-2">{friend.name}</p>
    </div>
  );
};
export default Profile;