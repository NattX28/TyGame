import Profile from "./components/Profile";
// import Scrollbar from "./components/FriendList";
import Search from "./components/Search";

const FriendList = () => {
  return (
    <>
      <Profile person={{name: "John Doe", avatar: "/media/images/first.jpg" }} />
      <Profile person={{name: "John Doe", avatar: "/media/images/first.jpg" }} />
      <Profile person={{name: "John Doe", avatar: "/media/images/first.jpg" }} />
      <Profile person={{name: "John Doe", avatar: "/media/images/first.jpg" }} />
      <Profile person={{name: "John Doe", avatar: "/media/images/first.jpg" }} />
      <Profile person={{name: "John Doe", avatar: "/media/images/first.jpg" }} />
      <Profile person={{name: "John Doe", avatar: "/media/images/first.jpg" }} />
      <Profile person={{name: "John Doe", avatar: "/media/images/first.jpg" }} />
      <Profile person={{name: "John Doe", avatar: "/media/images/first.jpg" }} />
      <Profile person={{name: "John Doe", avatar: "/media/images/first.jpg" }} />
      <Profile person={{name: "John Doe", avatar: "/media/images/first.jpg" }} />
      <Profile person={{name: "John Doe", avatar: "/media/images/first.jpg" }} />
      <Profile person={{name: "John Doe", avatar: "/media/images/first.jpg" }} />
      <Profile person={{name: "John Doe", avatar: "/media/images/first.jpg" }} />
    </>
  )
}

const page = () => {
  return (
    <div className="h-screen flex flex-row bg-black">
      <div className="border-r border-second h-full w-full max-md:hidden max-w-sm flex flex-col gap-4 py-4">
        <div className="px-8 pt-4">
          <p className="text-2xl font-bold tracking-widest">CHAT</p> 
        </div>
        <Search pholder={"Search chat"} />
        <div className="h-full w-full overflow-y-auto rounded-lg scrollbar-transparent">
          <FriendList />
        </div>
      </div>
      <div className="h-full w-full">
      </div>
      {/* <div className="bg-sub-frame h-full"></div> */}
    </div>
  );
};

export default page;
