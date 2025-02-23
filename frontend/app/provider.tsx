"use client";

import { useAuth } from "@/hooks/useAuth";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

const PUBLIC_PATHS = ["/", "/communities", "/login", "/register"];

export default function Providers({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (loading) return;

    const isPublicPath = PUBLIC_PATHS.includes(pathname);

    if (!user && !isPublicPath) {
      router.push("/login");
    }
  }, [user, loading, pathname, router]);

  if (loading) return <div>Loading...</div>;
  if (!user && !PUBLIC_PATHS.includes(pathname)) return null;

  return <>{children}</>;
}
