"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { logOut } from "./../services/user/user";

interface User {
  userid: string;
  username: string;
  name: string;
  role: "Super Admin" | "Admin" | "User";
  exp: number;
}

const isValidUser = (user: any): user is User => {
  return (
    typeof user?.userid === "string" &&
    typeof user?.username === "string" &&
    typeof user?.name === "string" &&
    ["Super Admin", "Admin", "User"].includes(user?.role) &&
    typeof user?.exp === "number" &&
    user?.exp > Math.floor(Date.now() / 1000) // Check if exp is in the future (not expired)
  );
};

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user") || "null");

    if (isValidUser(storedUser)) {
      setUser(storedUser);
    } else {
      setUser(null);
      localStorage.removeItem("user");
    }

    setLoading(false);
  }, []);

  const logout = async () => {
    try {
      const response = await logOut();
      document.cookie = `Authorization=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC`;
      localStorage.removeItem("user");

      setUser(null);
      router.push("/login");
    } catch (error) {
      console.log();
    }
  };

  return { user, loading, logout };
};
