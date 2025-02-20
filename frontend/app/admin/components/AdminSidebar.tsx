"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { Handshake, Home, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

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
  return (
    <div className="px-4 py-8 h-full flex flex-col">
      {/* Top section */}
      <div className="space-y-8">
        {/* Header sidebar */}
        <div className="flex flex-col items-center justify-center gap-3">
          <Avatar className="h-24 w-24 ">
            <AvatarImage
              src="https://github.com/shadcn.png"
              alt="@shadcn"
              className="rounded-full"
            />
            <AvatarFallback className="rounded-lg">CN</AvatarFallback>
          </Avatar>
          <div className="grid flex-1 text-center text-sm leading-tight">
            <span className="truncate font-semibold">username</span>
            <span className="truncate text-xs">example@email</span>
          </div>
        </div>

        {/* Navigation links */}
        <div className="flex flex-col gap-1">
          {items.map((item, index) => (
            <Button
              key={index}
              asChild
              className="w-full h-12 justify-start gap-2 rounded-sm px-4"
              variant="ghost">
              <Link href={item.url}>
                <item.icon className="h-4 w-4" />
                {item.title}
              </Link>
            </Button>
          ))}
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
    </div>
  );
};

export default AdminSidebar;
