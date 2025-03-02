import React, { useState, useRef } from "react";
import axios from "axios";
import FormData from "form-data";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
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

const FeedPostModal = ({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) => {
  const [postContent, setPostContent] = useState("");
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      // Validate the file using Zod schema
      imageSchema.parse({ file });

      // If validation passes, set the image and create preview
      setSelectedImage(file);
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
      setError(null);
    } catch (err) {
      if (err instanceof z.ZodError) {
        setError(err.errors[0].message);
      } else {
        setError("An error occurred while validating the image.");
      }
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    let data = new FormData();
    data.append("content", postContent);
    data.append("community_id", "15616556");
    data.append("image", selectedImage);

    try {
      const res = await axios.post("/api/submit", data, {
        headers: {
          ...data.getHeaders(),
        },
        withCredentials: true,
      });
      console.log(res.data);
      onClose();
    } catch (error:any) {
      setError(error);
    }
    setPostContent("");
    setSelectedImage(null);
    setImagePreview(null);
    setError(null);
    onClose();
  };
  const removeImage = (e:any) => {
    e.preventDefault();
    setSelectedImage(null);
    setImagePreview(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  if (!isOpen) return null;

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <div className="fixed inset-0 bg-black/75 flex items-center justify-center z-50">
        <Card className="w-full max-w-lg mx-4">
          <CardHeader className="relative border-b">
            <h2 className="text-xl font-semibold text-center">Create Post</h2>
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-2 top-2"
              onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </CardHeader>

          <CardContent className="p-4">
            <div className="flex items-start space-x-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-gray-300 flex-shrink-0" />
              <div className="flex-grow">
                <div className="font-semibold">User Name</div>
                <div className="text-sm text-gray-500">Public</div>
              </div>
            </div>

            <Input
              placeholder="What's on your mind?"
              className="min-h-[150px] resize-none border-none focus-visible:ring-0"
              value={postContent}
              onChange={(e) => setPostContent(e.target.value)}
            />
            {imagePreview && (
              <div className="relative mt-4">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="max-h-[300px] w-full object-cover rounded-lg"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute top-2 right-2 bg-black/50 hover:bg-black/70"
                  onClick={removeImage}>
                  <X className="h-4 w-4 text-white" />
                </Button>
              </div>
            )}

            {/* Error Message */}
            {error && <div className="mt-2 text-sm text-red-500">{error}</div>}
          </CardContent>

          <CardFooter className="flex flex-col space-y-4 border-t p-4">
            {!imagePreview && (
              <div className="flex items-center w-full rounded-lg border p-3">
                <span className="font-semibold">Add to your post</span>
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

            <Button
              type="submit"
              className="w-full"
              disabled={!postContent.trim() && !selectedImage}>
              Post
            </Button>
          </CardFooter>
        </Card>
      </div>
    </form>
  );
};

export default FeedPostModal;
