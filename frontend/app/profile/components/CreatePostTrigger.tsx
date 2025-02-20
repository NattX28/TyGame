"use client";
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ImageIcon } from "lucide-react";
import FeedPostModal from "@/app/feed/components/FeedPostModal";

interface ProfileData {
  username: string;
  fullName: string;
  avatar: string;
  posts: number;
  friends: number;
  bio: string;
}

interface ProfileFeedProps {
  profile: ProfileData;
}

const CreatePostTrigger = ({ profile }: ProfileFeedProps) => {
  const [isModalOpen, setIsModalOpen] = React.useState(false);

  return (
    <>
      <Card className="w-full bg-second shadow-sm hover:bg-second transition-colors border-forth">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <Avatar className="w-10 h-10">
              <AvatarImage src={profile?.avatar} alt={profile?.username} />
              <AvatarFallback>{profile?.username?.[0]}</AvatarFallback>
            </Avatar>

            <div className="flex-1 flex gap-2">
              <Button
                variant="outline"
                className="flex-1 justify-start h-11 px-4 bg-forth hover:bg-forth border-0 text-gray-500 hover:text-gray-400"
                onClick={() => setIsModalOpen(true)}>
                What are you thinking rn ....
              </Button>

              <Button
                variant="outline"
                className="h-11 px-4 bg-forth hover:bg-forth border-0"
                onClick={() => setIsModalOpen(true)}>
                <ImageIcon className="w-5 h-5 text-gray-500" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <FeedPostModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
};

export default CreatePostTrigger;
