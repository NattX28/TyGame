import api from "../api";
import { Post } from "@/utils/types";

export const getPosts = async (): Promise<Post[]> => {
  const { data } = await api.get<Post[]>("/posts");
  return data;
};
