import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { ImageIcon, Smile, X } from "lucide-react";

const FeedPostModal = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const [postContent, setPostContent] = useState('');

  const handleSubmit = () => {
    // Handle post submission here
    console.log('Post content:', postContent);
    setPostContent('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/75 flex items-center justify-center z-50">
      <Card className="w-full max-w-lg mx-4">
        <CardHeader className="relative border-b">
          <h2 className="text-xl font-semibold text-center">Create Post</h2>
          <Button 
            variant="ghost" 
            size="icon" 
            className="absolute right-2 top-2"
            onClick={onClose}
          >
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
        </CardContent>

        <CardFooter className="flex flex-col space-y-4 border-t p-4">
          <div className="flex items-center w-full rounded-lg border p-3">
            <span className="font-semibold">Add to your post</span>
            <div className="ml-auto flex space-x-2">
              <Button variant="ghost" size="icon" className="text-green-500">
                <ImageIcon className="h-5 w-5" />
              </Button>
            </div>
          </div>

          <Button 
            className="w-full"
            disabled={!postContent.trim()}
            onClick={handleSubmit}
          >
            Post
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default FeedPostModal;