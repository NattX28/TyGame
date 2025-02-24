"use client";
import { useAuth } from "@/hooks/useAuth";
import UserSidebar from "../../components/shared/UserSidebar";
import Button from "./components/ModalBtn";
import OnlineFriendList from "@/components/friends/OnlineFriendList";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function FeedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // const { user, loading } = useAuth();
  // const router = useRouter();

  // useEffect(() => {
  //   // ถ้าไม่มี user ให้ทำการ redirect ไปยังหน้า login
  //   if (!user) {
  //     router.push("/login");
  //   }
  // }, [user, router]);

  // if (loading) return <div>Loading...</div>;

  // // ถ้า user ยังไม่มี จะไม่ render อะไรจนกว่า redirect เสร็จ
  // if (!user) return null;

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
          <Button />
        </header>
        <main className="flex-1 p-4">{children}</main>
      </div>

      <aside className="hidden lg:block h-screen sticky top-0">
        <div className="h-full bg-main p-4 overflow-y-auto border-second border-l-2">
          <h2 className="text-xl font-semibold mb-6">Online</h2>
          <OnlineFriendList />
        </div>
      </aside>
    </div>
  );
}
