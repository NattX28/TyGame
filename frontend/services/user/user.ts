import api from "../api";
import { UpdateUserRequest } from "@/types/user";
import { LoginResponse, RegisterResponse } from "@/types/auth";
import { MessageBackend } from "@/types/samePattern";

const BASE_URL_USER: string = "/users";

//// POST
//login
export const login = async (
  username: string,
  password: string
): Promise<LoginResponse> => {
  try {
    const { data } = await api.post(`${BASE_URL_USER}/login`, {
      username,
      password,
    });
    return data;
  } catch (error) {
    console.log("login failed: ", error);
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
    const { data } = await api.post(`${BASE_URL_USER}/register`, {
      username,
      email,
      password,
    });
    return data;
  } catch (error) {
    console.log("register failed: ", error);
    throw new Error("Register failed");
  }
};

// logout
export const logout = async (): Promise<MessageBackend> => {
  try {
    const { data } = await api.post(`${BASE_URL_USER}/logout`);
    return data;
  } catch (error) {
    console.log("logout failed: ", error);
    throw new Error("Logout failed");
  }
};

// Refresh Token
export const refreshToken = async (): Promise<MessageBackend> => {
  try {
    const { data } = await api.post(`${BASE_URL_USER}/refresh-token`);
    return data;
  } catch (error) {
    console.log("refresh token failed: ", error);
    throw new Error("refresh token failed");
  }
};

// Report
