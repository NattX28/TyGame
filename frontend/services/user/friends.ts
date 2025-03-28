import { MessageBackend } from "@/types/samePattern";
import { api } from "../api";
import { Friend } from "@/types/types";

const BASE_URL_FRIENDS = "users/friends";

// get all friends
export const getAllFriends = async (): Promise<Friend[]> => {
  try {
    const { data } = await api.get(`${BASE_URL_FRIENDS}/get`);
    return data.friends;
  } catch (error) {
    console.log("add friend failed: ", error);
    throw new Error("cannot list all friends.");
  }
};

export const countfriends = async (userId: string): Promise<number> => {
  try {
    const { data } = await api.get(`${BASE_URL_FRIENDS}/${userId}/count`);
    return data.count;
  } catch (error) {
    console.log("check friend failed: ", error);
    throw new Error("check Friend failed");
  }
};

export const checkfriend = async (userId: string): Promise<boolean> => {
  try {
    const { data } = await api.get(`${BASE_URL_FRIENDS}/${userId}/check`);
    return data.isFriend;
  } catch (error) {
    console.log("check friend failed: ", error);
    throw new Error("check Friend failed");
  }
};

// add friend(follow)
export const followfriends = async (userId: string): Promise<MessageBackend> => {
  try {
    const { data } = await api.post(`${BASE_URL_FRIENDS}/add`, {userId});
    return data;
  } catch (error) {
    console.log("add friend failed: ", error);
    throw new Error("Add Friend failed");
  }
};

// delete friend (unfollow)
export const unfollowFriend = async (userId: string): Promise<MessageBackend> => {
  try {
    const { data } = await api.delete(`${BASE_URL_FRIENDS}/remove`, { data: { userId } });
    return data;
  } catch (error) {
    console.log("remove friend failed: ", error);
    throw new Error("Unfollow this friend failed");
  }
};
