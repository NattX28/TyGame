import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { checkAuth } from "@/services/user/auth";
import type { AuthResponse } from "@/types/auth";

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

export const useRedirectAuth = (path: string = "/feed") => {
  const router = useRouter();

  useEffect(() => {
    checkAuth().then(({ authenticated }) => {
      if (authenticated) {
        router.push(path);
      }
    });
  }, [router]);
};
