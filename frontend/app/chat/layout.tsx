// import OnlineFriend from "@/components/friends/OnlineFriend";
// import FeedSidebar from "./components/FeedSidebar";
// import Button from "./components/ModalBtn";
// import OnlineFriendList from "@/components/friends/OnlineFriendList";

export default function FeedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-[280px,1fr,240px] w-full">
      {/* Left Sidebar (hidden on mobile) */}
      <aside className="hidden md:block h-screen sticky top-0">
        <div className="h-full bg-main overflow-y-auto border-second border-r-2">
        </div>
      </aside>

      {/* Main content */}
      <div className="flex flex-col min-h-screen">
        {/* Header */}
        <header className="p-2 md:p-4 bg-main shadow-md sticky top-0 z-30 flex justify-between items-center">
          <h1 className="text-2xl font-bold">TyGame</h1>
        </header>

        {/* Main Content */}
        <main className="flex-1 p-4">{children}</main>
      </div>

      {/* Right Sidebar (hidden on mobile) */}
      <aside className="hidden lg:block h-screen sticky top-0">
        <div className="h-full bg-main p-4 overflow-y-auto border-second border-l-2">
          <h2 className="text-xl font-semibold mb-6">Online</h2>
        </div>
      </aside>
    </div>
  );
}
