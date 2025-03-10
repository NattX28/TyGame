// src/app/profile/edit/page.tsx
"use client";

import { useState, useRef, FormEvent, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Save, X, Upload } from "lucide-react";
import {
  updateProfilePic,
  updateUser,
} from "@/services/user/protectedRoute";
import { UserProfile } from "@/types/types";
import { getUserData } from "@/services/user/user";
import { useAuth } from "@/hooks/useAuth";

export default function EditProfile() {
  const router = useRouter();
  const { user: userAuth } = useAuth();

  const [user, setUser] = useState<UserProfile>({
    id: "",
    name: "",
    bio: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  // ดึงข้อมูลโปรไฟล์ผู้ใช้เมื่อโหลดคอมโพเนนต์
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        if (userAuth == undefined) {
          throw new Error("get user data failed");
        }
        const userData = await getUserData(userAuth.userid);
        if (userData.id != undefined) {
          setUser({
            id: userData.id,
            name: userData.name,
            bio: userData.description || "",
          });
        }
      } catch (err) {
        setError("Failed to load profile data");
        console.error(err);
      }
    };

    fetchUserProfile();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setUser((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);

      // สร้าง URL สำหรับแสดงตัวอย่างรูปภาพที่เลือก
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setSuccess("");

    try {
      // ขั้นตอนที่ 1: อัปโหลดรูปภาพถ้ามีการเลือกรูปใหม่
      if (selectedFile) {
        const uploadResult = await updateProfilePic(selectedFile);
        if (uploadResult && uploadResult.image) {
          setUser((prev) => ({ ...prev, image_name: uploadResult.image }));
        }
      }

      // ขั้นตอนที่ 2: อัปเดตข้อมูลโปรไฟล์
      const updateData = {
        name: user.name,
        description: user.bio, // ใช้ description แทน bio
      };

      const result = await updateUser(updateData);
      setSuccess("Profile updated successfully!");

      // อัปเดต state ด้วยข้อมูลที่ได้รับกลับมา
      setUser((prev) => ({
        ...prev,
        name: result.user.name || prev.name,
        bio: result.user.bio || prev.bio,
      }));

      setTimeout(() => {
        router.push("/profile");
      }, 1500);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  // กำหนด URL ของรูปภาพโปรไฟล์
  const getProfileImageUrl = () => {
    if (previewUrl) return previewUrl;
    if (user.image_name) return `/uploads/users/${user.image_name}`;
    return "/api/placeholder/150/150";
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4 md:p-6">
      <div className="bg-frame rounded-xl shadow-lg overflow-hidden">
        <div className="bg-main h-32 relative">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-[#900000] to-[#151515] opacity-80"></div>
        </div>

        <div className="px-4 md:px-6 py-8 -mt-16">
          <div className="flex flex-col md:flex-row gap-8">
            <div className="flex flex-col items-center">
              <div
                className="relative w-32 h-32 rounded-full border-4 border-main bg-second overflow-hidden cursor-pointer group"
                onClick={triggerFileInput}>
                <Image
                  src={getProfileImageUrl()}
                  alt="Profile avatar"
                  fill
                  className="object-cover"
                  priority
                />
                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="text-main-color text-sm font-medium flex items-center">
                    <Upload className="w-4 h-4 mr-1" />
                    Change
                  </span>
                </div>
              </div>
              <input
                type="file"
                className="hidden"
                accept="image/jpeg,image/png,image/gif"
                ref={fileInputRef}
                onChange={handleFileChange}
              />
              <button
                type="button"
                onClick={triggerFileInput}
                className="mt-2 text-sm text-contrast-color hover:text-contrast-color">
                Upload new image
              </button>
            </div>

            <div className="flex-1">
              <h1 className="text-2xl font-bold text-title mb-6">
                Edit Profile
              </h1>

              <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                  <div className="bg-[#300] text-[#f55] p-3 rounded-lg text-sm">
                    {error}
                  </div>
                )}

                {success && (
                  <div className="bg-[#030] text-[#5f5] p-3 rounded-lg text-sm">
                    {success}
                  </div>
                )}

                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-title mb-1">
                    Display Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={user.name}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg border border-fifth bg-sub-frame text-main-color focus:ring-2 focus:ring-[#ce1212] focus:border-[#ce1212] transition-all"
                    required
                  />
                </div>

                <div>
                  <label
                    htmlFor="bio"
                    className="block text-sm font-medium text-title mb-1">
                    Bio
                  </label>
                  <textarea
                    id="bio"
                    name="bio"
                    value={user.bio}
                    onChange={handleChange}
                    rows={4}
                    className="w-full px-4 py-3 rounded-lg border border-fifth bg-sub-frame text-main-color focus:ring-2 focus:ring-[#ce1212] focus:border-[#ce1212] transition-all resize-none"></textarea>
                  <p className="mt-1 text-xs text-sub-title">
                    Write a short introduction about yourself
                  </p>
                </div>

                <div className="flex justify-end space-x-4 pt-4">
                  <button
                    type="button"
                    onClick={() => router.push("/profile")}
                    className="px-6 py-2.5 rounded-lg bg-main text-main-color border border-fifth hover:bg-forth transition-colors flex items-center">
                    <X className="w-4 h-4 mr-2" />
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="px-6 py-2.5 rounded-lg bg-third text-main-color hover:bg-third focus:ring-4 focus:ring-[#ce1212]/30 transition-colors disabled:opacity-70 flex items-center">
                    <Save className="w-4 h-4 mr-2" />
                    {isLoading ? "Saving..." : "Save Changes"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
