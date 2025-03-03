"use client";
import { Community } from "@/types/types";
import { listAllCommunities } from "@/services/community/communities";
import { useEffect, useState } from "react";
import AdminCommunityList from "./components/AdminCommunityList";
import AdminAddCommunity from "./components/AdminAddCommunity";
import AdminEditCommunity from "./components/AdminEditCommunity";
// Mock Data

const CommunitiesPage = () => {
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
    <>
      <div className="flex flex-col flex-wrap items-center">
        <AdminAddCommunity />
        <AdminEditCommunity />
      </div>
      <AdminCommunityList communities={communities} />
    </>
  );
};
export default CommunitiesPage;
