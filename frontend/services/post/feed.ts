import { api } from "../api";
import { getAllPost } from "@/types/response";


export const getPost = async (commuID: string): Promise<getAllPost> => {
  try {
    const { data } = await api.get(`posts/feeds/community/${commuID}`);
    return data;
  } catch (error) {
    console.log("Get post failed: ", error);
    throw new Error("get post failed");
  }
};
