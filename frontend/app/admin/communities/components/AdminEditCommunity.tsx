"use client";
import { Button } from "@/components/ui/button";
import { useState, useEffect, useRef } from "react";
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
import { editCommunity } from "@/services/community/communities"; // API function
import { listAllCommunities, getCommunityImage } from "@/services/community/communities"; // API to get communities list
import { ImageIcon, X } from "lucide-react";
import { Community, ReqCommunityForm } from "@/types/types";
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

const AdminEditCommunity = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [communities, setCommunities] = useState<Community[]>([]);
  const [selectedCommunity, setSelectedCommunity] = useState<ReqCommunityForm | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Fetch all communities for dropdown
    const loadCommunities = async () => {
      try {
        const response = await listAllCommunities();
        setCommunities(response);
      } catch (error: any) {
        Swal.fire("ERROR!!", error?.message, "error");
      }
    };
    loadCommunities();
  }, []);

  // Update community state for editable fields
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    if (selectedCommunity) {
      setSelectedCommunity({
        ...selectedCommunity,
        [e.target.name]: e.target.value,
      });
    }
  };

  // Handle Image Selection
  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      imageSchema.parse({ file });

      if (selectedCommunity) {
        setSelectedCommunity({
          ...selectedCommunity,
          image: file
        });
      }
      
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
    if (selectedCommunity) {
      setSelectedCommunity({
        ...selectedCommunity,
        image: undefined
      });
    }
  };

  const updateCategory = (type: string) => {
    if (selectedCommunity) {
      setSelectedCommunity({
        ...selectedCommunity,
        category: type,
      });
    }
  };

  const handleEditCommunity = async () => {
    if (!selectedCommunity) {
      Swal.fire("Error", "Please select a community to edit.", "error");
      return;
    }

    if (!selectedCommunity.name || !selectedCommunity.description || !selectedCommunity.category) {
      Swal.fire("Error", "Please fill in all required fields!", "error");
      return;
    }

    setLoading(true);
    
    const formData = new FormData();
    formData.append("name", selectedCommunity.name);
    formData.append("description", selectedCommunity.description);
    formData.append("category", selectedCommunity.category);
    
    if (selectedCommunity.image) {
      formData.append("image", selectedCommunity.image);
    }
    
    try {
      if (!selectedCommunity.uuid) {
        throw new Error("Community UUID is missing.");
      }
      await editCommunity(selectedCommunity.uuid, formData);
      Swal.fire("Success", "Community updated successfully!", "success");
      setIsOpen(false);
      setSelectedCommunity(null);
      setImagePreview(null);
    } catch (error: any) {
      Swal.fire("Error", error?.message, "error");
    } finally {
      setLoading(false);
    }
  };

  if (!communities) return <div>Loading communities...</div>;
  
  return (
    <div className="">
      <Button onClick={() => setIsOpen(true)}>Edit Community</Button>

      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-second text-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold mb-4">Edit Community</h3>

            {/* Step 1: Choose Community */}
            <div>
              <label className="block text-sm font-medium mb-10">
                Select Community:
              </label>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button className="w-full text-black bg-white">
                    {selectedCommunity
                      ? selectedCommunity.name
                      : "Choose Community"}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-full">
                  {communities.map((community) => (
                    <div
                      key={community.uuid}
                      className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-black"
                      onClick={() => {
                        setSelectedCommunity({
                          uuid: community.uuid,
                          name: community.name,
                          description: community.description,
                          category: community.category,
                          image: undefined
                        });
                        setImagePreview(getCommunityImage(community.image));
                      }}>
                      {community.name}
                    </div>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {selectedCommunity && (
              <>
                {/* Step 2: Edit Details */}
                <div className="mt-4">
                  <label className="block text-sm font-medium mb-1">
                    Community Name:
                  </label>
                  <input
                    type="text"
                    name="name"
                    className="w-full p-2 border rounded-md text-black mb-2"
                    value={selectedCommunity.name}
                    onChange={handleInputChange}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Description:
                  </label>
                  <textarea
                    name="description"
                    className="w-full p-2 border rounded-md text-black mb-2 max-h-40"
                    value={selectedCommunity.description}
                    onChange={handleInputChange}
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
                          {selectedCommunity.category === ""
                            ? "Game Types"
                            : selectedCommunity.category}
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="w-56">
                        <DropdownMenuLabel>Type :</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuRadioGroup
                          value={selectedCommunity.category}
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

                {/* Buttons */}
                <div className="flex justify-end space-x-3 mt-4">
                  <button
                    onClick={() => setIsOpen(false)}
                    className="px-4 py-2 border border-gray-600 rounded-md hover:bg-gray-700 transition-colors">
                    Cancel
                  </button>
                  <button
                    onClick={handleEditCommunity}
                    className="px-4 py-2 bg-blue-600 rounded-md hover:bg-blue-700 transition-colors"
                    disabled={loading}>
                    {loading ? "Updating..." : "Save Changes"}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminEditCommunity;