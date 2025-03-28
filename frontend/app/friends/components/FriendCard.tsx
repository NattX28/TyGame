import DeleteButton from "@/components/shared/DeleteButton";
import { unfollowFriend } from "@/services/user/friends";
import { getUserData, getUserImage } from "@/services/user/user";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import Link from "next/link";

import { Friend } from "@/types/types";
interface FriendCardProps {
  friend: Friend;
  onUnfriend: (id: string) => void; // รับฟังก์ชันจาก FriendList
}

const FriendCard = ({ friend, onUnfriend }: FriendCardProps) => {
  const handleDeleteFriend = async (id: string) => {
    // ลบเพื่อน
    try {
      const response = await unfollowFriend(id);
      onUnfriend(id);
      console.log(response);
      console.log(`Removing friend with ID: ${id}`);
    } catch (error) {
      console.log("delete friend error");
    }
  };

  return (
    <div
      key={friend.userid}
      className="flex items-center gap-6 bg-forth rounded-lg transition-all hover:bg-forth py-3 px-4">
      {/* Avatar */}
      <Link
        href={`/profile/${friend.userid}`}
        className="flex items-center flex-1 space-x-4 cursor-pointer">
        <Avatar className="h-11 w-11">
          <AvatarImage
            src={getUserImage(friend.userid)}
            alt="@shadcn"
            className="rounded-full"
          />
          <AvatarFallback className="rounded-lg">CN</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <p className="text-lg font-semibold">{friend.name}</p>
        </div>
      </Link>
      <DeleteButton
        itemId={friend.userid}
        itemType="friend"
        onDelete={handleDeleteFriend}
        buttonText="Unfollow"
        modalTitle="Unfollow this friend?"
        modalDescription="Are you sure you want to unfollow this person from your friends list?"
      />
    </div>
  );
};
export default FriendCard;
