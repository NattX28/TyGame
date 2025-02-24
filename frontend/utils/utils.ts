import {
  CircleUserRound,
  Home,
  MessageCircleMore,
  Joystick,
} from "lucide-react";

export const userSidebarItems = [
  {
    title: "Home",
    url: "/feed",
    icon: Home,
  },
  {
    title: "My Profile",
    url: "/profile",
    icon: CircleUserRound,
  },
  {
    title: "Message",
    url: "/chat",
    icon: MessageCircleMore,
  },
  {
    title: "Communities",
    url: "/communities",
    icon: Joystick,
  },
];
