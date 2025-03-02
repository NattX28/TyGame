import { RecentRoom } from "@/types/types";
import Image from 'next/image';

const RoomList = ({ recentRooms }: { recentRooms: RecentRoom[] }) => {
  return (
    recentRooms.map((room) => (
      <div key={room.room_id}>
        <div className="py-2 px-8 flex items-center hover:bg-second transition">
          <Image
            fill
            src={room.room_id}
            alt={room.room_name}
            className="rounded-full"
          />
        {/* status online */}
        {/* <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-third rounded-full"></div> */}
        </div>
        <div className="ml-2 mx-2">
          <p className="text-sm text-title">{room.room_name}</p>
          <p className="text-xs text-sub-title">{"You: D Kub · 1h"}</p>
        </div>
      </div>
    ))
  );
};
export default RoomList;
