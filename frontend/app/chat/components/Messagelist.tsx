import { ChatMessage } from "@/types/types";
import Image from 'next/image';

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
      <Image
        width={40}
        height={40}
        src={Message.sender_id}
        alt={Message.sender_id.toString()}
        className="rounded-full w-10 h-10 mr-4"
      />
      <div className="bg-second rounded-3xl px-3 py-1 max-w-sm md:max-w-80 lg:max-w-lg xl:max-w-xl">
        <p className="my-1 break-words whitespace-normal">{Message.content}</p>
      </div>
    </div>
  );
};

const MessageList = ({ Messages }: { Messages: ChatMessage[] }) => {
  return (
    Messages.map((message) => (
      ( message.sender_id === "me" ) ? (
        <MsgMe key={message.id} Message={message} />
      ) : (
        <MsgYou key={message.id} Message={message} />
      )
    ))
  );
};

export default MessageList