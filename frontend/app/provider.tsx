"use client";

import LoadingScreen from "@/components/loading/LoadingScreen";
import { useAuth } from "@/hooks/useAuth";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

const PUBLIC_PATHS = ["/", "/explore", "/login", "/register"];
const PROTECTED_PATHS = ["/feed", "/profile", "/chat", "/community", "/party", "/friends"];
const ADMIN_PATHS = ["/admin"];
const ALL_VALID_PATHS = [...PUBLIC_PATHS, ...PROTECTED_PATHS, ...ADMIN_PATHS];

export default function Providers({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (loading) return;

    const isValidPath = ALL_VALID_PATHS.some(
      (validPath) => pathname === validPath || pathname.startsWith(`${validPath}/`)
    );

    const isPublicPath = PUBLIC_PATHS.some(
      (publicPath) => pathname === publicPath || pathname.startsWith(`${publicPath}/`)
    );

    if (!isValidPath) {
      router.push("/404"); // Redirect to a 404 page for invalid paths
      return;
    }

    if (!user && !isPublicPath) {
      router.push("/login");
    }
  }, [user, loading, pathname, router]);

  if (loading) return <LoadingScreen />;

  return <>{children}</>;
}
