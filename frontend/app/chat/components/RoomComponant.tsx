import moment from "moment";
import { getChatRoomImage } from "@/services/chat/chat";
import { ChatMessage, Room } from "@/types/types";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { getUserImage } from "@/services/user/user";

const RoomComponant = ({
  room,
  messages,
  onRoomSelect,
}: {
  room: Room;
  messages: Record<string, ChatMessage[]>;
  onRoomSelect: (roomId: string) => void;
}) => {

  return (
    <button
      key={room.room_id}
      className="hover:cursor-pointer w-full"
      onClick={() => onRoomSelect(room.room_id)} // Call onRoomSelect
    >
      <div className="py-3 px-8 flex items-center hover:bg-second transition">
        <Avatar className="w-12 h-12 rounded-full mr-4">
          <AvatarImage
            className="rounded-full"
            src={
              room.is_group
                ? getChatRoomImage(room.image_room)
                : getUserImage(room.user?.id || "")
            }
            alt="Community Avatar"
          />
          <AvatarFallback className="flex items-center justify-center w-full h-full bg-gray-500 rounded-full">
            {room.room_name.slice(0, 2)}
          </AvatarFallback>
        </Avatar>
        <div className="ml-2 mx-2 text-left">
          <p className="text-base text-title">{room.room_name}</p>
          <p className="text-sm text-sub-title">
          {
            messages[room.room_id]?.length > 0 ?
              `${messages[room.room_id][0].content} · ${moment(messages[room.room_id][0].timestamp * 1000).fromNow()}` : 
              room.last_message != null ?
                `${room.last_message} · ${moment(room.timestamp * 1000).fromNow()}` :
                ""
          }
          </p>
        </div>
      </div>
    </button>
  );
};

export default RoomComponant;
