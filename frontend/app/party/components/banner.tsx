import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
interface BannerProps {
  users: string[];
}

const Banner = ({ users }: BannerProps) => {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-5 justify-around gap-5">
      {users.map((user, index) => (
        <div key={index} className="flex flex-col items-center">
          <Avatar className="h-28 w-28 md:h-32 md:w-32 xl:h-44 xl:w-44 2xl:w-56 2xl:h-56">
            <AvatarImage
              src={user !== "" ? `https://github.com/${user}.png` : ""}
              alt={user}
              className="rounded-full"
            />
            <AvatarFallback className="rounded-lg text-black">?</AvatarFallback>
          </Avatar>
          <div className="grid flex-1 text-center text-xl leading-tight mt-5">
            <span className="truncate font-bold">
              {user === "" ? "?" : user}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Banner;
