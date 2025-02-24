import { Community } from "@/types/types";
import AdminCommunityList from "./components/AdminCommunityList";

// Mock Data
const communityCards: Community[] = [
  {
    uuid: "1",
    name: "Minecraft",
    description:
      "A community for builders, miners, and adventurers in the Minecraft universe.",
    image: "https://example.com/images/minecraft.jpg",
    category: "Sandbox",
    members: 45000,
  },
  {
    uuid: "2",
    name: "League of Legends",
    description:
      "Join summoners around the world to discuss strategies, champions, and esports.",
    image: "https://example.com/images/league_of_legends.jpg",
    category: "MOBA",
    members: 72000,
  },
  {
    uuid: "3",
    name: "Valorant",
    description:
      "A tactical shooter fan base for discussing agents, maps, and competitive play.",
    image: "https://example.com/images/valorant.jpg",
    category: "Shooter",
    members: 38000,
  },
  {
    uuid: "4",
    name: "Genshin Impact",
    description:
      "Explore Teyvat with other adventurers. Share builds, quests, and lore.",
    image: "https://example.com/images/genshin_impact.jpg",
    category: "RPG",
    members: 60000,
  },
  {
    uuid: "5",
    name: "Elden Ring",
    description:
      "A community for Tarnished sharing tips, builds, and lore in the Lands Between.",
    image: "https://example.com/images/elden_ring.jpg",
    category: "Action RPG",
    members: 25000,
  },
  {
    uuid: "6",
    name: "Among Us",
    description:
      "Discuss strategies, stories, and memes about space crew and impostors.",
    image: "https://example.com/images/among_us.jpg",
    category: "Party",
    members: 54000,
  },
  {
    uuid: "7",
    name: "Call of Duty",
    description:
      "A hub for all Call of Duty fans discussing campaigns, multiplayer, and Warzone.",
    image: "https://example.com/images/call_of_duty.jpg",
    category: "Shooter",
    members: 82000,
  },
  {
    uuid: "8",
    name: "Fortnite",
    description:
      "Join the community for Battle Royale enthusiasts and creative builders.",
    image: "https://example.com/images/fortnite.jpg",
    category: "Battle Royale",
    members: 91000,
  },
  {
    uuid: "9",
    name: "The Sims",
    description:
      "A community for life simulation lovers sharing builds, stories, and mods.",
    image: "https://example.com/images/the_sims.jpg",
    category: "Simulation",
    members: 34000,
  },
  {
    uuid: "10",
    name: "Zelda: Breath of the Wild",
    description:
      "Connect with fellow adventurers to share secrets, puzzles, and epic tales.",
    image: "https://example.com/images/zelda_botw.jpg",
    category: "Adventure",
    members: 27000,
  },
];

const CommunitiesPage = () => {
  return (
    <>
      <AdminCommunityList communities={communityCards} />
    </>
  );
};
export default CommunitiesPage;
