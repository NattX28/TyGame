import { MessageBackend } from "@/types/samePattern";
import { BannedUser } from "@/types/types";
import { api } from "../api";

const BASE_URL_ADMINS = "/admin";

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
