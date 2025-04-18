
const Search = ({setSearchText}:{ setSearchText: (text: string) => void }) => {
  return (
    <div className="px-4">
      <div className="relative">
        <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <input 
          type="text"
          placeholder={"Search chat"}
          className="w-full bg-transparent text-title placeholder-gray-500 rounded-full py-2 pl-10 pr-4 border-2 border-second focus:outline-none focus:border-second"
          onChange={(e) => setSearchText(e.target.value)}
        />
      </div>
    </div>
  )
}

export default Search

