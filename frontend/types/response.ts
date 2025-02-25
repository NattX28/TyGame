import { Comment } from "./types";

export interface getCommentsResponse {
  message: string;
  comments: Comment[];
}
