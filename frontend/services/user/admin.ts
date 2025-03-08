import { MessageBackend } from "@/types/samePattern";
import { BannedUser } from "@/types/types";
import { api } from "../api";

const BASE_URL_ADMINS = "/user/admin";

//Ban User ***Can't use yet
export const Banuser = async (
  Banneduser: BannedUser
): Promise<MessageBackend> => {
  try {
    const { data } = await api.post(`${BASE_URL_ADMINS}/add`, Banneduser);
    return data;
  } catch (error) {
    console.log("Ban user failed: ", error);
    throw new Error("Ban user failed");
  }
};

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
export const getStatRegister = async (): Promise<number> => {
  try {
    const { data } = await api.get(`${BASE_URL_ADMINS}/count`);
    return data.user_count;
  } catch (error) {
    console.log("get count users failed: ", error);
    throw new Error("get count users failed");
  }
};