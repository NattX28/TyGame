import { MessageBackend } from "@/types/samePattern";
import { BannedUser, StatRegister, UserFullAccess } from "@/types/types";
import { api } from "../api";

const BASE_URL_ADMINS = "/users/admin";


// get all user every community
export const getAllUserAllCommunity = async (): Promise<number> => {
  try {
    const { data } = await api.get(`${BASE_URL_ADMINS}/count`);
    return data.user_count;
  } catch (error) {
    console.log("get count users failed: ", error);
    throw new Error("get count users failed");
  }
};

// get all user every community
export const getStatRegister = async (limit?: number): Promise<StatRegister[]> => {
  try {
    const { data } = await api.get(`${BASE_URL_ADMINS}/recent-register${limit ? `?months=${limit}` : ''}`);
    return data.stats;
  } catch (error) {
    console.log("get stat users failed: ", error);
    throw new Error("get stat users failed");
  }
};

export const banUser = async (form: BannedUser): Promise<string> => {
  try {
    const { data } = await api.post(`${BASE_URL_ADMINS}/ban`, form);
    return data.message;
  } catch (error) {
    console.log("ban user failed: ", error);
    throw new Error("ban user failed");
  }
};

export const unbanUser = async (userId: string): Promise<string> => {
  try {
    const { data } = await api.post(`${BASE_URL_ADMINS}/unban`, {userId});
    return data.message;
  } catch (error) {
    console.log("ban user failed: ", error);
    throw new Error("ban user failed");
  }
};

export const getUsersData = async (userids: string[]): Promise<UserFullAccess[]> => {
  try {
    const { data } = await api.post(`${BASE_URL_ADMINS}/getusersdata`, {
      userids: userids,
    });
    return data.users;
  } catch (error) {
    console.log("fetch user data failed: ", error);
    throw new Error("fetch user data failed");
  }
};