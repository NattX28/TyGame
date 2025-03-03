// Import API และ Type
import api from "../api";
import { Community, CreateCommunityForm } from "@/types/types";

const BASE_URL_COMMU: string = "/communities";

//// GET
// get all community
export const listAllCommunities = async (): Promise<Community[]> => {
  try {
    const { data } = await api.get(`${BASE_URL_COMMU}/getall`);
    return data.communities; // คืนค่า array ของ Community
  } catch (error) {
    console.error("listAllCommunities error: ", error);
    throw new Error("Failed to fetch communities");
  }
};

// ดึง Community ตาม ID
export const getCommunity = async (id: string): Promise<Community> => {
  try {
    const { data } = await api.get(`${BASE_URL_COMMU}/get/${id}`);
    return data; // คืนค่า Community ตาม ID ที่ส่งมา
  } catch (error) {
    console.error(`getCommunity error (id: ${id}): `, error);
    throw new Error(`Failed to fetch community with id ${id}`);
  }
};

export const getCommunityImage = (nameFile: string): string => {
  return `https://tygame.up.railway.app/${BASE_URL_COMMU}/profile/${nameFile}`;
};


//// POST
// create community
export const createCommunity = async (formData: FormData) => {
  try {
    const { data } = await api.post(`${BASE_URL_COMMU}/create`, formData, {
      headers: {
        "Content-Type": "multipart/form-data"
      }
    });
    return data;
  } catch (error) {
    console.error("Create Community error: ", error);
    throw new Error("Create community failed");
  }
};

// join community
export const joinCommunity = async (commuID: string) => {
  try {
    console.log(commuID);
    const { data } = await api.post(`${BASE_URL_COMMU}/join/${commuID}`);
    return data;
  } catch (error) {
    console.error("Join Community error: ", error);
    throw new Error("Join community failed");
  }
};

//// PUT
export const editCommunity = async (id: string) => {
  try {
    const { data } = await api.put(`${BASE_URL_COMMU}/edit/${id}`);
    return data;
  } catch (error) {
    console.error("Edit Community error: ", error);
    throw new Error("Edit community failed");
  }
};

//// DELETE
// delete community
export const deleteCommunity = async (id: string) => {
  try {
    const { data } = await api.delete(`${BASE_URL_COMMU}/delete/${id}`);
    return data;
  } catch (error) {
    console.error("Delete Community error: ", error);
    throw new Error("Delete community failed");
  }
};
