import { Person } from "@/types/person";

const MsgMe = ({msg}:{msg:string}) => {
  return (
    <div className="mx-4 flex flex-row-reverse mb-1 text-[15px]">
      <div className="bg-second rounded-3xl px-3 py-1 max-w-sm md:max-w-80 lg:max-w-lg xl:max-w-xl">
        <p className="my-1">
          {msg}
        </p>
      </div>
    </div>
  )
}

const MsgYou = ({msg, person}:{msg:string, person:Person}) => {
  return (
    <div className="max-w-full mx-4 flex mb-1 text-[15px]">
      <img
        src={person.avatar}
        alt={person.name}
        className="rounded-full w-10 h-10 mr-4"
      />
      <div className="bg-second rounded-3xl px-3 py-1 max-w-sm md:max-w-80 lg:max-w-lg xl:max-w-xl">
       <p className="my-1 break-words whitespace-normal">
          {msg}
        </p>
      </div>
    </div>
  )
}

export {
  MsgMe,
  MsgYou
}