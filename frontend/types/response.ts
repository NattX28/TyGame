import { Comment, FeedPost } from "./types";

export interface getCommentsResponse {
  message: string;
  comments: Comment[];
}

export interface getAllPost {
  message: string;
  post: FeedPost[];
}
