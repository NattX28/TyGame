"use client";
import CommunityCard from "@/components/card/CommunityCard";
import { Community } from "@/types/types";
import { useState, useEffect } from "react";
import { listAllCommunities } from "@/services/community/communities";

const CommunityList = () => {
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
    <div className="max-w-screen-2xl mx-auto p-12">
      <h1 className="text-2xl font-bold mb-8">Choose a Community</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-8">
        {communities.map((community, index) => (
          <CommunityCard key={index} community={community} />
        ))}
      </div>
    </div>
  );
};
export default CommunityList;
