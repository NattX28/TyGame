import api from "../api";
import { getAllPost } from "@/types/response";

const BASE_URL_FEED: string = "/feeds";

export const getPost = async (commuID: string): Promise<getAllPost> => {
  try {
    const { data } = await api.get(`${BASE_URL_FEED}/community/${commuID}`);
    return data;
  } catch (error) {
    console.log("Get post failed: ", error);
    throw new Error("get post failed");
  }
};
