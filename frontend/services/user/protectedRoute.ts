// CRUD for user
import { UpdateUserRequest } from "@/types/user";
import api from "../api";
import { AuthResponse } from "./../../types/auth";
import { MessageBackend } from "@/types/samePattern";
import { User } from "@/types/types";

const BASE_URL_PROTECTED: string = "/protected";

// updateUserProfile
export const updateProfilePic = async (imageFile: File) => {
  try {
    const formData = new FormData();
    formData.append("image", imageFile);

    const { data } = await api.post(
      `${BASE_URL_PROTECTED}/upload-profile`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return data;
  } catch (error) {
    console.error("Profile update failed:", error);
    throw new Error("Profile update failed");
  }
};

//Update User
export const updateUser = async (updateData: UpdateUserRequest) => {
  try {
    const { data } = await api.put(
      `${BASE_URL_PROTECTED}/profile`,
      updateData,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    return data;
  } catch (error) {
    console.error("Error updating user:", error);
    throw new Error("Failed to update user profile");
  }
};

// delete account
export const deleteAccount = async (): Promise<MessageBackend> => {
  try {
    const { data } = await api.delete(`${BASE_URL_PROTECTED}/delete`, {});
    return data;
  } catch (error) {
    console.log("Error deleting user:", error);
    throw new Error("Failed to delete account");
  }
};

//getuserprofile
export const getUserProfile = async (): Promise<User> => {
  try {
    const { data } = await api.get(`${BASE_URL_PROTECTED}/profile`);
    return data;
  } catch (error) {
    console.error("Error fetching user profile:", error);
    throw new Error("Failed to fetch user profile");
  }
};
