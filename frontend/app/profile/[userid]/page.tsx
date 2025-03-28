"use client";
import { User } from "@/types/types";
import ProfileFeed from "../components/ProfileFeed";
import ProfileHeader from "../components/ProfileHeader";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getUserData } from "@/services/user/user";

// wait to call api

const OtherUserProfile = () => {
  const userid = useParams().userid as string;
  const [profileData, setProfileData] = useState<User | null>(null);

  useEffect(() => {
    if (!userid) return;

    // เรียก API เพื่อดึงข้อมูลโปรไฟล์
    const fetchProfile = async () => {
      try {
        const data = await getUserData(userid);
        setProfileData(data);
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    };

    fetchProfile();
  }, [userid]);

  if (!profileData) return <p>Loading...</p>;

  if (!profileData) {
    return <p className="text-center text-red-400">User not found.</p>;
  }

  return (
    <div className="max-w-4xl mx-auto pt-16 pb-4 px-12 space-y-16">
      <ProfileHeader
        profile={profileData}
      />
      <div className="w-full bg-second h-[1px]"></div>
      <ProfileFeed profile={profileData} />
    </div>
  );
};
export default OtherUserProfile;
