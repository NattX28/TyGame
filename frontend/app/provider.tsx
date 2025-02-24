"use client";

import LoadingScreen from "@/components/loading/LoadingScreen";
import { useAuth } from "@/hooks/useAuth";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

// real
// const PUBLIC_PATHS = ["/", "/communities", "/login", "/register"];
// test
const PUBLIC_PATHS = [
  "/",
  "/communities",
  "/login",
  "/register",
  "/feed",
  "/profile",
  "/chat",
];
// real
// const PROTECTED_PATHS = ["/feed", "/profile", "/chat"];
// test
const PROTECTED_PATHS = ["/void"];
const ADMIN_PATHS = ["/admin"];

const ALL_VALID_PATHS = [...PUBLIC_PATHS, ...PROTECTED_PATHS, ...ADMIN_PATHS];

export default function Providers({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (loading) return;
    console.log("pathname in provider : ", pathname);

    // Check if the path is valid
    const isValidPath = ALL_VALID_PATHS.some(
      (validPath) =>
        pathname === validPath || pathname.startsWith(`${validPath}/`)
    );

    // Only handle redirects for valid paths
    if (isValidPath) {
      const isPublicPath = PUBLIC_PATHS.includes(pathname);
      if (!user && !isPublicPath) {
        console.log("!user && !isPublicPath");
        router.push("/login");
      }
      console.log("อยู่นอก ");
    }
  }, [user, loading, pathname, router]);

  if (loading) return <LoadingScreen />;

  // Only block rendering for valid protected paths
  const isValidPath = ALL_VALID_PATHS.some(
    (validPath) =>
      pathname === validPath || pathname.startsWith(`${validPath}/`)
  );
  const isPublicPath = PUBLIC_PATHS.includes(pathname);

  if (isValidPath && !user && !isPublicPath) return null;

  return <>{children}</>;
}
