import DeleteButton from "@/components/shared/DeleteButton";
import { unfollowFriend } from "@/services/user/friends";
import { getUserImage } from "@/services/user/user";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import Link from "next/link";

interface Friend {
  id: string;
  name: string;
  avatar: string;
  isOnline: boolean;
}

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
      key={friend.id}
      className="flex items-center gap-6 bg-forth rounded-lg transition-all hover:bg-forth py-2 px-4">
      {/* Avatar */}
      <Link
        href={`/profile/${friend.id}`}
        className="flex items-center flex-1 space-x-4 cursor-pointer">
        <Avatar className="h-16 w-16">
          <AvatarImage
            src={getUserImage(friend.id)}
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
        itemId={friend.id}
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
