"use client";
import { User } from "@/types/types";
import CreatePostTrigger from "./components/CreatePostTrigger";
import ProfileFeed from "./components/ProfileFeed";
import ProfileHeader from "./components/ProfileHeader";
import axios from "axios";
import { useEffect, useState } from "react";
import { getUserProfile } from "@/services/user/protectedRoute";

// Mock Data
// const profileData: User = {
// id: "12345",
// username: "johndoe",
// email: "johndoe@example.com",
// name: "John",
// role: "admin",
// posts: 42,
// friends: 150,
// cookieVersion: 2,
// fullName: "John Doe",
// bio: "Full-stack developer and tech enthusiast.",
// imageName: "https://randomuser.me/api/portraits/men/3.jpg",
// description: "Loves coding and solving problems.",
// };

// wait to call api
const Profile = () => {
  // เสร็จแล้วรอ merge
  const [profile, setProfile] = useState<User>();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await getUserProfile();
        setProfile(data);
      } catch (error) {
        console.error("Error fetching profile", error);
      }
    };

    fetchProfile();
  }, []);

  if (!profile) {
    return <div className="text-center py-10">Profile not found.</div>;
  }
  return (
    <div className="max-w-4xl mx-auto pt-16 pb-4 px-12 space-y-16">
      <ProfileHeader profile={profile} isOwnProfile={true} />
      <div className="w-full bg-second h-[1px]"></div>
      <CreatePostTrigger profile={profile} />
      <ProfileFeed profile={profile} />
    </div>
  );
};
export default Profile;
