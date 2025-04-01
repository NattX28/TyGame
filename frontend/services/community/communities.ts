// Import API และ Type
import { api, Endpoint_Gateway } from "../api";
import { Community } from "@/types/types";

const BASE_URL_COMMU: string = "/communities";

//// GET
// get all community
export const listAllCommunities = async (
  limit?: number
): Promise<Community[]> => {
  try {
    const { data } = await api.get(
      `${BASE_URL_COMMU}/getall${limit ? `?limit=${limit}` : ""}`
    );
    return data.communities; // คืนค่า array ของ Community
  } catch (error) {
    console.error("listAllCommunities error: ", error);
    throw new Error("Failed to fetch communities");
  }
};

export const getAmountCommunity = async (): Promise<number> => {
  try {
    const { data } = await api.get(`${BASE_URL_COMMU}/getamount`);
    return data.amount;
  } catch (error) {
    console.error(`getAmountCommunity error : `, error);
    throw new Error(`Failed to fetch community amount`);
  }
};

const CommunityCache: Record<string, Community> = {};
export const getCommunity = async (uuid: string): Promise<Community> => {
  if (!uuid) throw new Error("get user data failed");
  if (CommunityCache[uuid]) {
    return CommunityCache[uuid];
  }

  try {
    const { data } = await api.get(`${BASE_URL_COMMU}/${uuid}`);
    CommunityCache[uuid] = data.community;
    return data.community;
  } catch (error) {
    console.error(`getCommunity error (id: ${uuid}): `, error);
    throw new Error(`Failed to fetch community with id ${uuid}`);
  }
};

export const getCommunityMember = async (id: string): Promise<string[]> => {
  try {
    const { data } = await api.get(`${BASE_URL_COMMU}/${id}/members`);
    return data.userIds; // คืนค่า Community ตาม ID ที่ส่งมา
  } catch (error) {
    console.error(`getCommunity error (id: ${id}): `, error);
    throw new Error(`Failed to fetch community with id ${id}`);
  }
};

export const getCommunityImage = (nameFile: string): string => {
  return `${Endpoint_Gateway}${BASE_URL_COMMU}/profile/${nameFile}`;
};

// join community
export const joinCommunity = async (commuID: string) => {
  try {
    console.log(commuID);
    const { data } = await api.post(`${BASE_URL_COMMU}/${commuID}`);
    return data.community;
  } catch (error) {
    console.error("Join Community error: ", error);
    throw new Error("Join community failed");
  }
};

//// POST
// create community
export const createCommunity = async (formData: FormData) => {
  try {
    const { data } = await api.post(`${BASE_URL_COMMU}/create`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return data;
  } catch (error) {
    console.error("Create Community error: ", error);
    throw new Error("Create community failed");
  }
};

//// PUT
export const editCommunity = async (uuid: string, formData: FormData) => {
  try {
    const { data } = await api.put(`${BASE_URL_COMMU}/${uuid}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
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

export const getCommunitys = async (
  commuIDs: string[],
  limit?: number
): Promise<Community[]> => {
  try {
    const { data } = await api.post(
      `${BASE_URL_COMMU}/getcommus${limit ? `?limit=${limit}` : ""}`,
      {
        commuIDs: commuIDs,
      }
    );
    return data.communities; // คืนค่า array ของ Community
  } catch (error) {
    console.error("getCommunitys error: ", error);
    throw new Error("Failed to fetch communities");
  }
};
