import { MessageBackend } from "@/types/samePattern";
import api from "../api";
import { Friend } from "@/types/types";

const BASE_URL_FRIENDS = "/friends";

// get all friends
export const getAllFriends = async (): Promise<Friend[]> => {
  try {
    const { data } = await api.get(`${BASE_URL_FRIENDS}/get`);
    return data;
  } catch (error) {
    console.log("add friend failed: ", error);
    throw new Error("cannot list all friends.");
  }
};

// add friend(follow)
export const addfriends = async (friendid: string): Promise<MessageBackend> => {
  try {
    const { data } = await api.post(`${BASE_URL_FRIENDS}/add`, friendid);
    return data;
  } catch (error) {
    console.log("add friend failed: ", error);
    throw new Error("Add Friend failed");
  }
};

// delete friend (unfollow)
export const unfollowFriend = async (
  friendid: string
): Promise<MessageBackend> => {
  try {
    const { data } = await api.delete(`${BASE_URL_FRIENDS}/remove/${friendid}`);
    return data;
  } catch (error) {
    console.log("remove friend failed: ", error);
    throw new Error("Unfollow this friend failed");
  }
};
