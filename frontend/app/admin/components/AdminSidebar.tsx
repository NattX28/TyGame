"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { Handshake, Home, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { usePathname } from "next/navigation";
import { getUserImage } from "@/services/user/user";

const items = [
  {
    title: "Dashboard",
    url: "/admin",
    icon: Home,
  },
  {
    title: "Communities",
    url: "/admin/communities",
    icon: Handshake,
  },
];

const AdminSidebar = () => {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  return (
    user && (<div className="px-4 py-8 h-full flex flex-col">
      {/* Top section */}
      <div className="space-y-8">
        {/* Header sidebar */}
        <div className="flex flex-col items-center justify-center gap-3">
          <Avatar className="max-h-24 max-w-24">
            <AvatarImage
              src={getUserImage(user.userid)}
              alt="@shadcn"
              className="rounded-full object-cover"
            />
            <AvatarFallback className="rounded-lg">CN</AvatarFallback>
          </Avatar>
          <div className="grid flex-1 text-center text-sm leading-tight">
            <span className="truncate font-semibold">{user.name}</span>
            <span className="truncate text-xs">{user.username}</span>
          </div>
        </div>

        {/* Navigation links */}
        <div className="flex flex-col gap-1">
          {items.map((item, index) => {
            const isActive = pathname === item.url;
            return (
              <Button
                key={index}
                asChild
                className={`w-full h-12 justify-start gap-2 rounded-sm px-4
                  ${
                    isActive
                      ? "bg-white text-black"
                      : "bg-transparent text-white"
                  } `}
                variant="ghost">
                <Link href={item.url}>
                  <item.icon className="h-4 w-4" />
                  {item.title}
                </Link>
              </Button>
            );
          })}
        </div>
      </div>

      {/* footer */}
      {/* Logout button */}
      <div className="mt-auto pt-4">
        <Button
          className="w-full h-12 justify-start gap-2 rounded-sm px-4"
          variant={"ghost"}
          asChild>
          <Link href={"#"}>
            <LogOut className="h-4 w-4" />
            <span>{"Logout"}</span>
          </Link>
        </Button>
      </div>
    </div>)
  );
};

export default AdminSidebar;
