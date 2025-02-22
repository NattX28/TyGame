import api from "../api";
import { Post } from "@/types/types";

const BASE_URL_POST = "/post";

export const getPosts = async (): Promise<Post[]> => {
  const { data } = await api.get<Post[]>("/posts");
  return data;
};
