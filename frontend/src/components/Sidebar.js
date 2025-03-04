import { Home } from 'react-icons/fa';

// ...existing code...

const lastCommunity = localStorage.getItem("lastCommunity");
const feedURL = lastCommunity ? `/feed/${lastCommunity}` : "/feed";

export const userSidebarItems = [
  {
    title: "Home",
    url: feedURL,
    icon: Home,
  },
  // ...existing code...
];
