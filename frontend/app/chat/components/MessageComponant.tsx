import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { ChatMessage, User } from "@/types/types";
import { getUserData, getUserImage } from "@/services/user/user";

const MsgMe = ({ Message }: { Message: ChatMessage }) => {
  return (
    <div className="mx-4 flex flex-row-reverse mb-1 text-[15px]">
      <div className="bg-second rounded-3xl px-3 py-1 max-w-sm md:max-w-80 lg:max-w-lg xl:max-w-xl">
        <p className="my-1">{Message.content}</p>
      </div>
    </div>
  );
};

const MsgYou = ({ Message }: { Message: ChatMessage }) => {
  return (
    <div className="max-w-full mx-4 flex mb-1 text-[15px]">
      <Avatar className="w-8 h-8 md:w-10 md:h-10 rounded-full mr-4">
        <AvatarImage className="rounded-full" src={getUserImage(Message.sender_id)} alt="Community Avatar" />
        <AvatarFallback className="flex items-center justify-center w-full h-full bg-gray-500 rounded-full">
          {getUserData(Message.sender_id).then((user: User) => user.name.slice(0, 2))}
        </AvatarFallback>
      </Avatar>
      <div className="bg-second rounded-3xl px-3 py-1 max-w-sm md:max-w-80 lg:max-w-lg xl:max-w-xl">
        <p className="my-1 break-words whitespace-normal">{Message.content}</p>
      </div>
    </div>
  );
};

const MessageComponant = ({ userID, message }: { userID: string ;message: ChatMessage }) => {
  if (message.sender_id == userID) {
    return (
      <MsgMe key={message.id} Message={message} />
    )
  } else {
    return (
      <MsgYou key={message.id} Message={message} />
    )
  }
};

export default MessageComponant