"use client";
import UserSidebar from "@/components/shared/UserSidebar";
import Button from "./[id]/components/ModalBtn";
import FindPartyButton from "@/components/party/FindPartyButton";
import PeopleInCommunity from "@/components/people/PeopleInCommunity";

export default function FeedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-[280px,1fr,240px] w-full">
      <aside className="hidden md:block h-screen sticky top-0">
        <div className="h-full bg-main overflow-y-auto border-second border-r-2">
          <UserSidebar />
        </div>
      </aside>

      <div className="flex flex-col min-h-screen">
        <header className="p-2 md:p-4 bg-main shadow-md sticky top-0 z-30 flex justify-between items-center">
          <h1 className="text-2xl font-bold">TyGame</h1>
          <FindPartyButton />
          <Button />
        </header>
        <main className="flex-1 p-4">{children}</main>
      </div>

      <aside className="hidden lg:block h-screen sticky top-0">
        <div className="h-full bg-main p-4 overflow-y-auto border-second border-l-2">
          <h2 className="text-xl font-semibold mb-6">Who is in Commu ..</h2>
          <PeopleInCommunity />
        </div>
      </aside>
    </div>
  );
}
