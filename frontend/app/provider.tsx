"use client";

import LoadingScreen from "@/components/loading/LoadingScreen";
import { useAuth } from "@/hooks/useAuth";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

// real
const PUBLIC_PATHS = ["/", "/explore", "/login", "/register"];

// real
const PROTECTED_PATHS = [
  "/feed",
  "/profile",
  "/chat",
  "/community",
  "/party",
  "/friends",
];

const ADMIN_PATHS = ["/admin"];

const ALL_VALID_PATHS = [...PUBLIC_PATHS, ...PROTECTED_PATHS, ...ADMIN_PATHS];

export default function Providers({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (loading) return;
    console.log("pathname in provider : ", pathname);

    // ตรวจสอบว่า path ถูกต้อง
    const isValidPath = ALL_VALID_PATHS.some(
      (validPath) =>
        pathname === validPath || pathname.startsWith(`${validPath}/`)
    );

    // ตรวจสอบว่าเป็น public path
    const isPublicPath = PUBLIC_PATHS.some(
      (publicPath) =>
        pathname === publicPath || pathname.startsWith(`${publicPath}/`)
    );

    console.log("Path validation in Provider:");
    console.log(" - pathname:", pathname);
    console.log(" - isValidPath:", isValidPath);
    console.log(" - isPublicPath:", isPublicPath);

    // สำหรับการทดสอบ เราจะข้ามการตรวจสอบการเข้าถึงและอนุญาตทุก path
    // คอมเมนต์โค้ดด้านล่างไว้ชั่วคราว

    // Only handle redirects for valid paths
    if (isValidPath) {
      if (!user && !isPublicPath) {
        console.log("!user && !isPublicPath - redirecting to login");
        router.push("/login");
      }
    }
  }, [user, loading, pathname, router]);

  if (loading) return <LoadingScreen />;

  // ตรวจสอบว่า path ถูกต้องและเป็น public path โดยใช้วิธีเดียวกันในทุกที่
  const isValidPath = ALL_VALID_PATHS.some(
    (validPath) =>
      pathname === validPath || pathname.startsWith(`${validPath}/`)
  );

  const isPublicPath = PUBLIC_PATHS.some(
    (publicPath) =>
      pathname === publicPath || pathname.startsWith(`${publicPath}/`)
  );

  // ในโหมดทดสอบเราจะไม่ block การเรนเดอร์ เพื่อให้เข้าถึงทุก path ได้
  // คอมเมนต์โค้ดด้านล่างไว้ชั่วคราว

  if (isValidPath && !user && !isPublicPath) return null;

  // ทุก path จะแสดงผลได้ในโหมดทดสอบ
  return <>{children}</>;
}
