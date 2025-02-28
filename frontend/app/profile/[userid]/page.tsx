"use client";
import { User } from "@/types/types";
import ProfileFeed from "../components/ProfileFeed";
import ProfileHeader from "../components/ProfileHeader";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

// wait to call api

const OtherUserProfile = () => {
  const { userid } = useParams();
  const [profileData, setProfileData] = useState<User | null>(null);
  const [isFollowing, setIsFollowing] = useState(false);

  useEffect(() => {
    if (!userid) return;

    // เรียก API เพื่อดึงข้อมูลโปรไฟล์
    const fetchProfile = async () => {
      try {
        const res = await fetch(`/api/users/${userid}`);
        if (!res.ok) throw new Error("Failed to fetch user data");
        const data = await res.json();
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
        isOwnProfile={false}
        isFollowing={isFollowing}
      />
      <div className="w-full bg-second h-[1px]"></div>
      <ProfileFeed profile={profileData} />
    </div>
  );
};
export default OtherUserProfile;
