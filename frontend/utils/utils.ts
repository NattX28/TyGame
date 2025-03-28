import {
  CircleUserRound,
  Home,
  MessageCircleMore,
  Joystick,
  Contact,
  ShieldCheck,
} from "lucide-react";

const lastCommunity = localStorage.getItem("lastCommunity");
const feedURL = lastCommunity ? `/feed/${lastCommunity}` : "/explore";

const setupUserSidebarItems = [
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
];;

const storedUser = localStorage.getItem("user");
if (storedUser && storedUser !== "undefined") {
  try {
    const parsedUser = JSON.parse(storedUser);
    if (parsedUser.role === "Admin" || parsedUser.role === "Super Admin") {
      setupUserSidebarItems.push({
        title: "Admin Panel",
        url: "/admin",
        icon: ShieldCheck,
      });
    }
  } catch (error) {
    console.error("Error parsing user from localStorage:", error);
  }
}

export const userSidebarItems = setupUserSidebarItems;
