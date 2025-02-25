import { Comment } from "./types";

export interface getMessageResponse {
  message: string;
}

export interface getCommentsResponse {
  message: string;
  comments: Comment[];
}
