import { getCommentsResponse } from "@/types/response";
import api from "../api";

const BASE_URL_COMMENT: string = "/posts";

export const editComment = async (
  postID: string,
  CommentID: string
): Promise<getCommentsResponse> => {
  try {
    const { data } = await api.put(
      `${BASE_URL_COMMENT}/${postID}/${CommentID}`
    );
    return data;
  } catch (error) {
    console.log("Edit comment failed: ", error);
    throw new Error("Edit comment failed");
  }
};

export const DeleteComment = async (
  postID: string,
  CommentID: string
): Promise<getCommentsResponse> => {
  try {
    const { data } = await api.delete(
      `${BASE_URL_COMMENT}/${postID}/${CommentID}`
    );
    return data;
  } catch (error) {
    console.log("Delete comment failed: ", error);
    throw new Error("Delete comment failed");
  }
};

export const LikeComment = async (
  postID: string,
  CommentID: string
): Promise<getCommentsResponse> => {
  try {
    const { data } = await api.get(
      `${BASE_URL_COMMENT}/${postID}/${CommentID}/like`
    );
    return data;
  } catch (error) {
    console.log("Like comment failed: ", error);
    throw new Error("Like comment failed");
  }
};

export const UnlikeComment = async (
  postID: string,
  CommentID: string
): Promise<getCommentsResponse> => {
  try {
    const { data } = await api.get(
      `${BASE_URL_COMMENT}/${postID}/${CommentID}/unlike`
    );
    return data;
  } catch (error) {
    console.log("Unlike comment failed: ", error);
    throw new Error("Unlike comment failed");
  }
};
