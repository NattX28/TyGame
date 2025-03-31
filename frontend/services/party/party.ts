import { api } from "../api";
import { PartyResponse } from "@/types/types";

const BASE_URL_PARTY: string = "/party";
const BASE_URL_WS: string = "/ws";

//find Party
export const findparty = async (
  maxSlots: string,
  community_id: string
): Promise<PartyResponse> => {
  try {
    console.log(community_id, "Hello party");
    const { data } = await api.get(
      `/party/find/${community_id}/?max_slots=${maxSlots}`
    );
    return data;
  } catch (error) {
    console.error("Error finding party", error);
    throw new Error("Failed to find party");
  }
};
