import {
  CircleUserRound,
  Home,
  MessageCircleMore,
  Joystick,
  Contact,
} from "lucide-react";

const lastCommunity = localStorage.getItem("lastCommunity");
const feedURL = lastCommunity ? `/feed/${lastCommunity}` : "/explore";

export const userSidebarItems = [
  {
    title: "Home",
    url: feedURL,
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
    title: "Friends",
    url: "/friends",
    icon: Contact,
  },
  {
    title: "Communities",
    url: "/communities",
    icon: Joystick,
  },
];
