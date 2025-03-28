"use client"; 
import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import Search from "./Search";
import Link from "next/link";
import { User } from "@/types/types";

const Navbar = () => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const rawUser = localStorage.getItem("user")
    if (rawUser) {
      try {
        const storedUser = JSON.parse(rawUser || "{}");
        setUser(storedUser);
        console.log("user in navbar : ", storedUser);
      } catch (error) {
        console.log("error in navbar : ", error);
      }
    }
  }, []);

  return (
    <nav>
      <div className="flex justify-between items-center h-16">
        Logo
        <div className="hidden md:inline-block">
          <Search />
        </div>
        <div className="flex gap-2 sm:gap-4">
          {user ? (
            <div>
              <Button>
                <Link href={"/explore"}>Explore</Link>
              </Button>
            </div>
          ) : (
            <>
              <div>
                <Button>
                  <Link href={"/signin"}>Signup</Link>
                </Button>
              </div>
              <div>
                <Button variant="outline" asChild>
                  <Link href={"/login"}>Login</Link>
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};
export default Navbar;
