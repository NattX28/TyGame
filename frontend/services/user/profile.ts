// CRUD for user
import { AuthResponse } from "@/utils/types";
import api from "../api";

export const getProfile = async () => {
  try {
    const { data } = await api.get("/protected/profile");
    return data;
  } catch (error) {
    console.error(
      "Error fetching profile:",
      error.response?.data || error.message
    );
    throw new Error("getProfile failed");
  }
};

export const updateProfile = async (imageFile) => {
  try {
    const formData = new FormData();
    formData.append("image", imageFile);

    const { data } = await api.post("/protected/profile", formData, {
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
