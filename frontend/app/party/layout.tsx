"use client"
import { Menu } from "lucide-react";
import { cn } from "@/lib/utils";
import {useState,createContext,useEffect} from "react"
import UserSidebar from "../../components/shared/UserSidebar"

export const layout=({ children }: { children: React.ReactNode })=> {
const [isOpen, setIsOpen] = useState(false);
    
  return (
        <div className="flex h-screen justify-around sm:justify-normal">
        {/* Mobile Toggle Button */}
        <button
            className="md:hidden p-3 fixed top-4 left-4 z-50 bg-main text-white rounded-md"
            onClick={() => setIsOpen(!isOpen)}>
            <Menu className="w-6 h-6" />
        </button>

        {/* Sidebar */}
        <div
            className={cn(
            "fixed inset-y-0 left-0 w-64 bg-main text-white flex flex-col transition-all border-second border-r-2",
            "md:relative md:translate-x-0 md:w-[280px]",
            isOpen ? "translate-x-0  z-10" : "-translate-x-full"
            )}>
            {/* User Profile */}
            <UserSidebar />
        </div>

        {/* page.tsx */}
        <main className="flex-1 overflow-y-auto h-screen content-center">{children}</main>
        </div>
  );
}

export default layout;