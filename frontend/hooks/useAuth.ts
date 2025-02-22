import { useRouter } from "next/navigation";
import { checkAuth, logout as apiLogout } from "@/services/user/auth";
import { useEffect, useState, useCallback } from "react";

// Hook สำหรับหน้าที่ต้องการ auth
export const useRequireAuth = () => {
  const router = useRouter();

  useEffect(() => {
    checkAuth().then(({ authenticated }) => {
      if (!authenticated) {
        router.push("/login");
      }
    });
  }, [router]);
};

// Hook สำหรับหน้าที่ต้อง redirect ถ้า auth แล้ว (เช่น หน้า login)
export const useRedirectAuth = (path: string = "/feed") => {
  const router = useRouter();

  useEffect(() => {
    const verifyAuth = async () => {
      const { authenticated } = await checkAuth();
      if (authenticated) {
        router.push(path);
      }
    };

    verifyAuth();
  }, [router, path]);
};

// Hook สำหรับ logout
export const useLogout = () => {
  const router = useRouter();

  const logout = useCallback(async () => {
    await apiLogout();
    router.push("/login");
  }, [router]);

  return logout;
};

// Utility function สำหรับเช็ค auth (ไม่มี routing)
export const checkAuthentication = async (): Promise<boolean> => {
  const { authenticated } = await checkAuth();
  return authenticated;
};
