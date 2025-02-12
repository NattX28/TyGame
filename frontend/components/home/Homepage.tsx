import CommunityCard from "../card/CommunityCard";
import CommunityCardContainer from "../card/CommunityCardContainer";
import HeroHompage from "./HeroHompage";
import { CommunityCardProps } from "@/types/community";

// Mock Data
const communityCards: CommunityCardProps[] = [
  {
    commuID: 1,
    name: "Minecraft",
    description:
      "A community for builders, miners, and adventurers in the Minecraft universe.",
    categoryID: 101,
    category: "Sandbox",
    image: "https://example.com/images/minecraft.jpg",
    created_at: new Date("2020-03-15"),
    members: 45000,
  },
  {
    commuID: 2,
    name: "League of Legends",
    description:
      "Join summoners around the world to discuss strategies, champions, and esports.",
    categoryID: 102,
    category: "MOBA",
    image: "https://example.com/images/league_of_legends.jpg",
    created_at: new Date("2019-08-10"),
    members: 72000,
  },
  {
    commuID: 3,
    name: "Valorant",
    description:
      "A tactical shooter fan base for discussing agents, maps, and competitive play.",
    categoryID: 103,
    category: "Shooter",
    image: "https://example.com/images/valorant.jpg",
    created_at: new Date("2021-04-22"),
    members: 38000,
  },
  {
    commuID: 4,
    name: "Genshin Impact",
    description:
      "Explore Teyvat with other adventurers. Share builds, quests, and lore.",
    categoryID: 104,
    category: "RPG",
    image: "https://example.com/images/genshin_impact.jpg",
    created_at: new Date("2020-09-28"),
    members: 60000,
  },
  {
    commuID: 5,
    name: "Elden Ring",
    description:
      "A community for Tarnished sharing tips, builds, and lore in the Lands Between.",
    categoryID: 105,
    category: "Action RPG",
    image: "https://example.com/images/elden_ring.jpg",
    created_at: new Date("2022-02-25"),
    members: 25000,
  },
  {
    commuID: 6,
    name: "Among Us",
    description:
      "Discuss strategies, stories, and memes about space crew and impostors.",
    categoryID: 106,
    category: "Party",
    image: "https://example.com/images/among_us.jpg",
    created_at: new Date("2018-11-16"),
    members: 54000,
  },
  {
    commuID: 7,
    name: "Call of Duty",
    description:
      "A hub for all Call of Duty fans discussing campaigns, multiplayer, and Warzone.",
    categoryID: 107,
    category: "Shooter",
    image: "https://example.com/images/call_of_duty.jpg",
    created_at: new Date("2003-10-29"),
    members: 82000,
  },
  {
    commuID: 8,
    name: "Fortnite",
    description:
      "Join the community for Battle Royale enthusiasts and creative builders.",
    categoryID: 108,
    category: "Battle Royale",
    image: "https://example.com/images/fortnite.jpg",
    created_at: new Date("2017-07-25"),
    members: 91000,
  },
  {
    commuID: 9,
    name: "The Sims",
    description:
      "A community for life simulation lovers sharing builds, stories, and mods.",
    categoryID: 109,
    category: "Simulation",
    image: "https://example.com/images/the_sims.jpg",
    created_at: new Date("2000-02-04"),
    members: 34000,
  },
  {
    commuID: 10,
    name: "Zelda: Breath of the Wild",
    description:
      "Connect with fellow adventurers to share secrets, puzzles, and epic tales.",
    categoryID: 110,
    category: "Adventure",
    image: "https://example.com/images/zelda_botw.jpg",
    created_at: new Date("2017-03-03"),
    members: 27000,
  },
];

const Homepage = () => {
  return (
    <section>
      <HeroHompage />
      <CommunityCardContainer communities={communityCards} />
    </section>
  );
};
export default Homepage;
