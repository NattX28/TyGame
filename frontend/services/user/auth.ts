import api from "../api";
import { UpdateUserRequest } from "@/types/user";
import type {
  AuthResponse,
  LoginResponse,
  RegisterResponse,
} from "@/types/auth";

//// Check
export const checkAuth = async (): Promise<AuthResponse> => {
  try {
    const { data } = await api.get("/auth/check");
    return data;
  } catch (error) {
    console.error("Auth check failed:", error);
    return { authenticated: false };
  }
};

//// POST
//login
export const login = async (
  username: string,
  password: string
): Promise<LoginResponse> => {
  try {
    const { data } = await api.post("/users/login", { username, password });
    return data;
  } catch (error) {
    throw new Error("Login failed");
  }
};

//register
export const register = async (
  username: string,
  password: string,
  email: string
): Promise<RegisterResponse> => {
  try {
    const { data } = await api.post("/users/register", {
      username,
      email,
      password,
    });
    return data;
  } catch (error) {
    throw new Error("Register failed");
  }
};

export const logout = async () => {
  try {
    await api.post("/user/logout");
  } catch (error) {
    console.error("Logout failed:", error);
  }
};
