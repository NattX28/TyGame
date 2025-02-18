import { Smile, Mic, Image, Heart } from 'lucide-react';

const InputMessage = ({pholder}:{pholder:string}) => {
  return (
    <div className="bg-black p-1.5 m-4 rounded-full border-2 border-second flex items-center gap-2">
      <button className="p-2 text-gray-400 hover:text-gray-300">
        <Smile size={20} />
      </button>
      
      <input
        type="text"
        placeholder="Message..."
        className="flex-1 bg-transparent text-gray-200 placeholder-gray-500 outline-none"
      />
      
      <div className="flex items-center gap-2">
        <button className="p-2 text-gray-400 hover:text-gray-300">
          <Mic size={20} />
        </button>
        
        <button className="p-2 text-gray-400 hover:text-gray-300">
          <Image size={20} />
        </button>
        
        <button className="p-2 text-gray-400 hover:text-gray-300">
          <Heart size={20} />
        </button>
      </div>
    </div>
  )
}

export default InputMessage