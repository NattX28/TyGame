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
  const [user, setUser] = useState<User>(<User>{});
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (storedUser && storedUser !== "undefined") {
      try {
        const parsedUser = JSON.parse(storedUser);

        if (isValidUser(parsedUser)) {
          setUser(parsedUser);
        } else {
          setUser(<User>{});
          localStorage.removeItem("user");
          localStorage.removeItem("token");
        }
      } catch (error) {
        console.error("Error parsing user from localStorage:", error);
        setUser(<User>{});
        localStorage.removeItem("user");
        localStorage.removeItem("token");
      }
    } else {
      setUser(<User>{});
    }

    setLoading(false);
  }, []);

  const logout = async () => {
    try {
      const response = await logOut();
      localStorage.removeItem("user");
      localStorage.removeItem("token");

      setUser(<User>{});
      router.push("/login");
    } catch (error) {
      console.log();
    }
  };

  return { user, loading, logout };
};

