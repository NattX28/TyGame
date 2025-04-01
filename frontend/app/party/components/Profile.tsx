"use client";
import Profile from "@/app/profile/page";
import { useEffect } from "react";
import UserProfile from "./userprofile";

const Banner = (
{ 
    users
  } : {
    users: string[];
  }) => {

  useEffect(() => {

    console.log("Current users:", users);
  }, [users]);

  return (
    <div className="flex flex-wrap mx-auto gap-24">
      {users.map((user, index) => (
        <UserProfile key={index} user={user} index={index} />
      ))}
    </div>
  );
};

export default Banner;
