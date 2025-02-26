"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { logOut } from "./../services/user/user";

interface User {
  id: string;
  username: string;
  email: string;
  role: "admin" | "user";
}

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const token = document.cookie
      .split("; ")
      .find((row) => row.startsWith("Authorization="))
      ?.split("=")[1];

    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }

    // ดึงข้อมูล User จาก Cookie หรือ API ถ้าจำเป็น
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }

    setLoading(false);
  }, []);

  const login = (userData: User, token: string) => {
    document.cookie = `Authorization=${token}; path=/; Secure; HttpOnly`;
    localStorage.setItem("user", JSON.stringify(userData));
    setUser(userData);
    router.push("/feed"); // Redirect หลังจาก Login
  };

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

  return { user, loading, login, logout };
};
