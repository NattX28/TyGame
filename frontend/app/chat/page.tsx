// import LoginForm from "./components/LoginForm";
// import Scrollbar from "./components/FriendList";
import Search from "./components/Search";

const page = () => {
  return (
    <div className="p-4 h-screen bg-frame flex flex-row gap-4">
      <div className="bg-sub-frame h-full w-full max-md:hidden max-w-sm flex flex-col gap-4 px-4 py-4 ">
        <div className="w-full mx-2">
          <p className="text-2xl font-bold tracking-widest">CHAT</p> 
        </div>
        <Search pholder={"Search chat"} />
        <div className="h-full w-full overflow-y-auto rounded-lg p-4 scrollbar-transparent">
          {
            <div>
              
            </div>
          }
        </div>
      </div>
      <div className="bg-sub-frame h-full w-full">
      </div>
      {/* <div className="bg-sub-frame h-full"></div> */}
    </div>
  );
};

export default page;
