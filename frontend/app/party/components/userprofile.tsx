import { getUserData } from "@/services/user/user";
import { getUserImage } from "@/services/user/user";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

const UserProfile = ({user, index}:{user:string;index:number;}) => {
  const [username, setUsername] = useState("");
  const router = useRouter();

  useEffect(() => {
    const temp = async () => {
      const userprofile = await getUserData(user);
      setUsername(userprofile.username)
    }
    temp()
  }, []);
      
  return (
    <div key={index} className="flex flex-col items-center">
      <Avatar
        className="hover:cursor-pointer h-28 w-28 md:h-32 md:w-32 xl:h-44 xl:w-44 2xl:w-56 2xl:h-56"
        onClick={() => {
          router.push(`/profile/${user}`)
        }}
      >
        <AvatarImage
          src={getUserImage(user)}
          alt={user}
          className="rounded-full"
        />
        <AvatarFallback className="rounded-lg text-black">?</AvatarFallback>
      </Avatar>
      <div className="grid flex-1 text-center text-xl leading-tight mt-5">
        <span className="truncate font-bold">
          {user === "" ? "?" : username}
        </span>
      </div>
    </div>
  )
}

export default UserProfile