import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import FeedSidebar from "./components/FeedSidebar";
import { Button } from "@/components/ui/button";

export default function FeedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <div className="grid grid-cols-[auto,1fr] w-full">
        {/* Sidebar ฝั่งซ้าย */}
        <FeedSidebar />

        {/* Main content ตรงกลาง */}
        <main className="flex flex-col overflow-x-auto">
          <SidebarTrigger />
          {/* <SidebarTrigger /> */}
          {children} {/* ตรงนี้จะแสดงเนื้อหาจาก page.tsx */}
        </main>
      </div>
    </SidebarProvider>
  );
}
