"use client";
import { User } from "@/types/types";
import CreatePostTrigger from "./components/CreatePostTrigger";
import ProfileFeed from "./components/ProfileFeed";
import ProfileHeader from "./components/ProfileHeader";
import axios from "axios";
import { useEffect, useState } from "react";
import { getUserData } from "@/services/user/user";

const Profile = () => {
  const [profile, setProfile] = useState<User>();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const fetchProfile = async () => {
      try {
        const data = await getUserData(user.userid);
        console.log(data)
        setProfile(data);
      } catch (error) {
        console.error("Error fetching profile", error);
      }
    };

    if (user.userid) {
      fetchProfile();
    }
  }, []);

  return (
    profile ? (
      <div className="max-w-4xl mx-auto pt-16 pb-4 px-12 space-y-16">
        <ProfileHeader profile={profile} />
        <div className="w-full bg-second h-[1px]"></div>
        <CreatePostTrigger profile={profile} />
        <ProfileFeed profile={profile} />
      </div>
    ) : (
      <div className="text-center py-10">Profile not found.</div>
    )
  );
};
export default Profile;
