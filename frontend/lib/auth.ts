import axios from "axios";

// Type definition for auth response
interface AuthResponse {
  authenticated: boolean;
  user?: {
    id: string;
    username: string;
    email: string;
  };
}

export const checkAuth = async (): Promise<AuthResponse> => {
  try {
    const { data } = await axios.get("/api/auth/check", {
      withCredentials: true,
    });
    return data;
  } catch (error) {
    console.error("Auth check failed:", error);
    return { authenticated: false };
  }
};

export const requireAuth = async (router: any): Promise<boolean> => {
  const { authenticated } = await checkAuth();
  if (!authenticated) {
    router.push("/login");
    return false;
  }
  return true;
};

export const redirectIfAuth = async (
  router: any,
  path: string = "/feed"
): Promise<boolean> => {
  const { authenticated } = await checkAuth();
  if (authenticated) {
    router.push(path);
    return true;
  }
  return false;
};

export const logout = async (router: any): Promise<void> => {
  try {
    await axios.post("/api/auth/logout", {}, { withCredentials: true });
    router.push("/login");
  } catch (error) {
    console.error("Logout failed:", error);
  }
};
