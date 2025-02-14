
const Search = ({pholder}:{pholder:string}) => {
  return (
    <div className="relative">
      <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>
      <input 
        type="text" 
        placeholder={pholder}
        className="w-full bg-[#3a3b3c] text-gray-100 placeholder-gray-500 rounded-full py-2 pl-10 pr-4 focus:outline-none focus:ring-1 focus:ring-blue-500"
      />
      
    </div>
  )
}

export default Search

