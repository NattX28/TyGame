import api from "../api";
import { PartyResponse } from "@/types/types";

const BASE_URL_PARTY: string = "/party";
const BASE_URL_WS: string = "/ws";

//find Party
export const findparty = async (maxSlots: number): Promise<PartyResponse> => {
  try {
    const { data } = await api.get(`/party/find?max_slots=${maxSlots}`);
    return data;
  } catch (error) {
    console.error("Error finding party", error);
    throw new Error("Failed to find party");
  }
};
