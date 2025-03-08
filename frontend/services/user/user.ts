import { api, Endpoint_Gateway } from "../api";
import { jwtDecode } from "jwt-decode";
import { UpdateUserRequest, UserPublicData } from "@/types/user";
import { DecodedToken } from "@/types/auth";
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
    
    localStorage.setItem("user", JSON.stringify(data.user))
    return data;
  } catch (error: any) {
    console.log("login failed: ", error);

    if (error.response) {
      throw error.response.data;
    } else {
      throw new Error("Login failed. Please try again.");
    }
  }
};

//register
// register
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
  } catch (error: any) {
    console.error("Register failed:", error);

    // ตรวจสอบว่ามี response จาก API หรือไม่
    if (error.response) {
      throw error.response.data; // โยน error ที่ได้จาก API ออกไป
    } else {
      throw new Error("Register failed. Please try again.");
    }
  }
};

// logout
export const logOut = async (): Promise<MessageBackend> => {
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

//get user image
export const getUserImage = (id: string): string => {
  const path = `${Endpoint_Gateway}/users/${id}/avatar`;
  // console.log(path);
  return path;
};

// get user profile by id
export const getUserData = async (uuid: string): Promise<UserPublicData> => {
  try {
    const { data } = await api.get(`${BASE_URL_USER}/${uuid}`);
    return data;
  } catch (error) {
    console.log("get user data failed: ", error);
    throw new Error("get user data failed");
  }
};