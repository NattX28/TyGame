import { Room } from "@/types/types";
import { api, Endpoint_Gateway } from "../api";

const BASE_URL_CHAT: string = "/chat";

export const getChatRoomImage = (nameFile: string): string => {
  const path = `${Endpoint_Gateway}${BASE_URL_CHAT}/room/${nameFile}`;
  // console.log(path);
  return path;
};

export const createRoomReq = async (roomName: string, userIds: string[]): Promise<string> => {
  try {
    const { data } = await api.post(`${BASE_URL_CHAT}/rooms/create`, {
      user_ids : userIds,
      name: roomName,
    });
    return data.room_id;
  } catch (error) {
    console.error("Join Community error: ", error);
    throw new Error("Join community failed");
  }
};

export const getRecentRooms = async (): Promise<Room[]> => {
  try {
    const { data } = await api.get(`${BASE_URL_CHAT}/rooms/contacts`);
    return data.rooms;
  } catch (error) {
    console.error("Get recent rooms error: ", error);
    throw new Error("Get recent rooms failed");
  }
};