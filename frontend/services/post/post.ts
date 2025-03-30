import { getCommentsResponse, getMessageResponse } from "@/types/response";
import { api, Endpoint_Gateway } from "../api";
import { Comment, EditPostResponse, Post } from "@/types/types";

const BASE_URL_POSTS: string = "/posts";

export const getPostImage = (nameFile: string): string => {
  return `${Endpoint_Gateway}${BASE_URL_POSTS}/image/${nameFile}`;
};

export const createPost = async (
  imageFile: File | null,
  community_id: string,
  content: string,
  visibility: string
): Promise<Post> => {
  try {
    const formData = new FormData();
    if (imageFile) {
      formData.append("image", imageFile)
    }
    formData.append("community_id", community_id)
    formData.append("content", content)
    formData.append("visibility", visibility)

    const { data } = await api.post(`${BASE_URL_POSTS}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data"
      }
    });
    return data.post;
  } catch (error) {
    console.log("create post failed", error);
    throw new Error("create post failed");
  }
};

export const editPost = async (
  postID: string,
  formData: FormData,
): Promise<EditPostResponse> => {
  try {
    const { data } = await api.put(`${BASE_URL_POSTS}/${postID}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return data.post;
  } catch (error) {
    console.log("edit post failed", error);
    throw new Error("edit post failed");
  }
};

export const deletePost = async (
  postID: string
): Promise<getMessageResponse> => {
  try {
    const { data } = await api.delete(`${BASE_URL_POSTS}/${postID}`);
    return data;
  } catch (error) {
    console.log("delete post failed", error);
    throw new Error("delete post failed");
  }
};

export const likePost = async (
  postID: string
): Promise<getMessageResponse> => {
  try {
    const { data } = await api.get(`${BASE_URL_POSTS}/${postID}/like`);
    return data;
  } catch (error) {
    console.log("like post failed", error);
    throw new Error("like post failed");
  }
};

export const unlikePost = async (
  postID: string
): Promise<getMessageResponse> => {
  try {
    const { data } = await api.get(`${BASE_URL_POSTS}/${postID}/unlike`);
    return data;
  } catch (error) {
    console.log("unlike post failed", error);
    throw new Error("unlike post failed");
  }
};

export const getComments = async (
  postID: string
): Promise<Comment[]> => {
  try {
    const { data } = await api.get(`${BASE_URL_POSTS}/${postID}/comments`);
    return data.comments;
  } catch (error) {
    console.log("get all comments failed", error);
    throw new Error("get comments failed");
  }
};

export const createComments = async (
  postID: string,
  content: string,
): Promise<Comment> => {
  try {
    const { data } = await api.post(`${BASE_URL_POSTS}/${postID}/comments`, {
      content
    });
    return data.comment;
  } catch (error) {
    console.log("create comments failed", error);
    throw new Error("create comments failed");
  }
};