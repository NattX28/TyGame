// Import API และ Type
import api from "../api";
import { Community } from "@/types/types";

//// GET
// get all community
export const listAllCommunities = async (): Promise<Community[]> => {
  try {
    const { data } = await api.get("/communities/get");
    return data; // คืนค่า array ของ Community
  } catch (error) {
    console.error("listAllCommunities error: ", error);
    throw new Error("Failed to fetch communities");
  }
};

// ดึง Community ตาม ID
export const getCommunity = async (id: number): Promise<Community> => {
  try {
    const { data } = await api.get(`/communities/get/${id}`);
    return data; // คืนค่า Community ตาม ID ที่ส่งมา
  } catch (error) {
    console.error(`getCommunity error (id: ${id}): `, error);
    throw new Error(`Failed to fetch community with id ${id}`);
  }
};

//// POST
// create community
export const createCommunity = async (community: Community) => {
  try {
    const { data } = await api.post("communities/create", community);
    return data;
  } catch (error) {
    console.error("createCommunity error: ", error);
    throw new Error("create community failed");
  }
};

// join community
export const joinCommunity = async (commuID: number) => {
  try {
    console.log(commuID);
    const { data } = await api.post(`/communities/join/${commuID}`);
    return data;
  } catch (error) {
    console.error("createCommunity error: ", error);
    throw new Error("create community failed");
  }
};

//// PUT
export const editCommunity = async (id: number) => {
  try {
    const { data } = await api.put(`communities/edit/${id}`);
    return data;
  } catch (error) {
    console.error("deleteCommunity error: ", error);
    throw new Error("delete community failed");
  }
};

//// DELETE
// delete community
export const deleteCommunity = async (id: number) => {
  try {
    const { data } = await api.delete(`communities/delete/${id}`);
    return data;
  } catch (error) {
    console.error("deleteCommunity error: ", error);
    throw new Error("delete community failed");
  }
};
