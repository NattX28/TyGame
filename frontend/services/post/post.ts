import { getCommentsResponse } from "@/types/response";
import api from "../api";
import { Post } from "@/types/types";

const BASE_URL_POSTS: string = "/posts";

export const getComments = async (
  postID: string
): Promise<getCommentsResponse> => {
  try {
    const { data } = await api.get(`${BASE_URL_POSTS}/${postID}/comments`);
    return data;
  } catch (error) {
    console.log("get all comments failed", error);
    throw new Error("get comments failed");
  }
};

export const deletePost = async (
  postID: string
): Promise<getCommentsResponse> => {
  try {
    const { data } = await api.delete(`${BASE_URL_POSTS}/${postID}`);
    return data;
  } catch (error) {
    console.log("get all comments failed", error);
    throw new Error("get comments failed");
  }
};

export const likePost = async (
  postID: string
): Promise<getCommentsResponse> => {
  try {
    const { data } = await api.post(`${BASE_URL_POSTS}/${postID}/like`);
    return data;
  } catch (error) {
    console.log("get all comments failed", error);
    throw new Error("get comments failed");
  }
};
