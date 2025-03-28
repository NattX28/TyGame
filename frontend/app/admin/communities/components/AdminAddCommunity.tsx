"use client";
import { Button } from "@/components/ui/button";
import { useState, useRef } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Swal from "sweetalert2";
import { ReqCommunityForm } from "@/types/types";
import { createCommunity } from "@/services/community/communities";
import { ImageIcon, X } from "lucide-react";
import { z } from "zod";

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

const imageSchema = z.object({
  file: z
    .instanceof(File)
    .refine((file) => file.size <= MAX_FILE_SIZE, `Max image size is 5MB.`)
    .refine(
      (file) => ACCEPTED_IMAGE_TYPES.includes(file.type),
      "Only .jpg, .jpeg, .png and .webp formats are supported."
    ),
});

const Gametype: string[] = [
  "FPS",
  "MOBA",
  "Simulation",
  "Sandbox",
  "Battle Royal",
  "Adventure",
  "RPG",
  "Action RPG",
  "Party Game",
];

const AdminAddCommunity = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false); // beautify btn
  const [error, setError] = useState<string | null>(null);
  const [community, setCommunity] = useState<ReqCommunityForm>({
    name: "",
    description: "",
    category: "",
    image: undefined,
  });

  // Image Selection State
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle Image Selection
  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      imageSchema.parse({ file });

      setCommunity({
        ...community,
        image: file
      });
      setImagePreview(URL.createObjectURL(file));
      setError(null);
    } catch (err) {
      if (err instanceof z.ZodError) {
        setError(err.errors[0].message);
      } else {
        setError("An error occurred while validating the image.");
      }
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  // Remove Image
  const removeImage = (e: React.MouseEvent) => {
    e.preventDefault();
    setImagePreview(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // รอ test !!!
  const handleCreateCommunity = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!community.name || !community.description || !community.category || !community.image) {
      Swal.fire("Error", "Please fill in all required fields!", "error");
      return;
    }

    setLoading(true);

    const formData = new FormData();
    formData.append("name", community.name)
    formData.append("description", community.description)
    formData.append("category", community.category)
    formData.append("image", community.image);
    try {
      const response = await createCommunity(formData);
      Swal.fire("Success", "Community created successfully!", "success");
      setIsOpen(false);
      setCommunity({
        name: "",
        description: "",
        category: "",
        image: undefined,
      });
      console.log(response);
    } catch (error: any) {
      console.error("Failed to create community:", error);
      Swal.fire("ERROR!!", error?.message, "error");
    } finally {
      setLoading(false);
    }
  };

  const updateCategory = (type: string) => {
    setCommunity((prev) => ({
      ...prev,
      category: type,
    }));
  };
  return (
    <div className="">
      <Button onClick={() => setIsOpen(true)}>Add Community</Button>

      {/* Add Community Modal */}
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-second text-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold mb-4">Add Community</h3>

            <div>
              <label className="block text-sm font-medium mb-1">
                Community Name:
              </label>
              <input
                type="text"
                className="w-full p-2 border rounded-md text-black mb-2"
                value={community.name}
                onChange={(e) =>
                  setCommunity({ ...community, name: e.target.value })
                }
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Description:
              </label>
              <textarea
                className="w-full p-2 border rounded-md text-black mb-2 max-h-40"
                value={community.description}
                onChange={(e) =>
                  setCommunity({ ...community, description: e.target.value })
                }
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Category:
              </label>
              <div className="my-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button className="rounded-md bg-white text-black">
                      {community.category == ""
                        ? "Game Types"
                        : community.category}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56">
                    <DropdownMenuLabel>Type :</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuRadioGroup
                      value={community.category}
                      onValueChange={(val) => updateCategory(val)}>
                      {Gametype.map((type, index) => (
                        <DropdownMenuRadioItem
                          key={index}
                          value={type}
                          className="my-2">
                          {type}
                        </DropdownMenuRadioItem>
                      ))}
                    </DropdownMenuRadioGroup>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            {/* Image Upload Section */}
            <div>
              <label className="block text-sm font-medium mb-1">
                Upload Image:
              </label>
              <div className="flex items-center">
                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/*"
                  onChange={handleImageSelect}
                  className="hidden"
                  id="upload-image"
                />
                {!imagePreview && (
                  <div className="flex items-center w-full rounded-lg border p-3 mt-3">
                    <span className="font-semibold">Add to your Image</span>
                    <div className="ml-auto flex space-x-2">
                      <input
                        type="file"
                        ref={fileInputRef}
                        className="hidden"
                        accept={ACCEPTED_IMAGE_TYPES.join(",")}
                        onChange={handleImageSelect}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="text-green-600"
                        onClick={() => fileInputRef.current?.click()}>
                        <ImageIcon className="h-5 w-5" />
                      </Button>
                    </div>
                  </div>
                )}
              </div>

              {/* Image Preview */}
              {imagePreview && (
                <div className="relative mt-2">
                  <img
                    src={imagePreview}
                    alt="Selected"
                    className="w-full h-40 object-cover rounded-md"
                  />
                  <button
                    onClick={removeImage}
                    className="absolute top-2 right-2 bg-black bg-opacity-60 p-1 rounded-full text-white">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}

              {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
            </div>

            <div className="flex justify-end space-x-3 mt-4">
              <button
                onClick={() => setIsOpen(false)}
                className="px-4 py-2 border border-gray-600 rounded-md hover:bg-gray-700 transition-colors">
                Cancel
              </button>
              <button
                onClick={handleCreateCommunity}
                className="px-4 py-2 bg-red-600 rounded-md hover:bg-red-700 transition-colors"
                disabled={loading}>
                {loading ? "Creating..." : "Confirm"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminAddCommunity;
