// src/utils/auth.ts
import { checkAuth, logout as apiLogout } from "@/services/user/auth";
import { useRouter } from "next/router";

export const requireAuth = async (): Promise<boolean> => {
  const router = useRouter();
  const { authenticated } = await checkAuth();
  if (!authenticated) {
    router.push("/login");
    return false;
  }
  return true;
};

export const redirectIfAuth = async (
  path: string = "/feed"
): Promise<boolean> => {
  const router = useRouter();
  const { authenticated } = await checkAuth();
  if (authenticated) {
    router.push(path);
    return true;
  }
  return false;
};

export const logout = async (): Promise<void> => {
  const router = useRouter();
  await apiLogout();
  router.push("/login");
};
