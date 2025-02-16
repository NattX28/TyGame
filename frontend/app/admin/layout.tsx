"use client";
import { useState } from "react";
import { Menu } from "lucide-react";
import AdminSidebar from "./components/AdminSidebar";
import { cn } from "@/lib/utils";

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="flex h-screen justify-around sm:justify-normal">
      {/* Mobile Toggle Button */}
      <button
        className="md:hidden p-3 fixed top-4 left-4 z-50 bg-main text-white rounded-md"
        onClick={() => setIsOpen(!isOpen)}
      >
        <Menu className="w-6 h-6" />
      </button>

      {/* Sidebar */}
      <div
        className={cn(
          "fixed  inset-y-0 left-0 w-64 bg-main text-white p-4 flex flex-col transition-all",
          "md:relative md:translate-x-0 md:w-64",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* User Profile */}
        <AdminSidebar/>
      </div>
      {/* page.tsx */}
      <main>{children}</main>
    </div>
  );
};
export default AdminLayout;
