"use client";
import { listAllCommunities } from "@/services/community/communities";
import CommunityCard from "../card/CommunityCard";
import CommunityCardContainer from "../card/CommunityCardContainer";
import HeroHompage from "./HeroHompage";
import { useEffect, useState } from "react";
import { Community } from "@/types/types";


const Homepage = () => {
  const [communities, setCommunities] = useState<Community[]>([]);
    useEffect(() => {
      const fetchCommuCard = async () => {
        try {
          const data = await listAllCommunities();
          setCommunities(data);
        } catch (err) {
          console.log(err);
        }
      };
      fetchCommuCard();
    }, []);

  return (
    <section>
      <HeroHompage />
      {
        communities && <CommunityCardContainer communities={communities} />
      }
    </section>
  );
};
export default Homepage;