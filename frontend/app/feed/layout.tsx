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
      <div className="grid grid-cols-1 md:grid-cols-[auto,1fr] w-full min-h-screen">
        {/* Sidebar ฝั่งซ้าย */}
        <div className="hidden md:block">
          <FeedSidebar />
        </div>

        <div className="md:hidden">
          <FeedSidebar />
        </div>

        {/* Content wrapper */}
        <div className="flex flex-col">
          {/* Header with sticky */}
          <header className="p-2 md:p-6 bg-main sticky top-0 z-30">
            <div className="flex gap-4 items-center">
              <SidebarTrigger />
              <h1 className="text-2xl font-bold">TyGame</h1>
            </div>
          </header>

          {/* Main content */}
          <main className="flex-1 overflow-x-auto">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  );
}
