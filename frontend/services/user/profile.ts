// CRUD for user
import { UpdateUserRequest } from "@/types/user";
import api from "../api";
import { AuthResponse } from "./../../types/auth";

const BASE_URL_PROTECTED: string = "/protected";

export const getProfile = async () => {
  try {
    const { data } = await api.get("/protected/profile");
    return data;
  } catch (error) {
    console.error("Profile update failed:", error);
    throw new Error("getProfile failed");
  }
};

export const updateProfilePic = async (imageFile) => {
  try {
    const formData = new FormData();
    formData.append("image", imageFile);

    const { data } = await api.post(`${BASE_URL_PROTECTED}/profile`, formData, {
      headers: {
        "Content-Type": "multipart/form-data", // Ensure it’s set to multipart/form-data for file upload
      },
    });

    return data; // Return the response data
  } catch (error) {
    console.error("Profile update failed:", error);
    throw new Error("Profile update failed");
  }
};

//Update User
export const updateUser = async (updateData: UpdateUserRequest) => {
  try {
    // Make a PUT or PATCH request to update the user profile
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
