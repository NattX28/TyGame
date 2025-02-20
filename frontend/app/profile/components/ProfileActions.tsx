import { Button } from "@/components/ui/button";
import { Settings } from "lucide-react";

interface ProfileActionsProps {
  username: string;
}

const ProfileActions = ({ username }: ProfileActionsProps) => {
  return (
    <div className="flex items-center gap-4">
      <h1 className="text-xl font-semibold"> {username} </h1>
      <Button className="rounded-sm">Edit Profile</Button>
      <Settings className="w-6 h-6 text-gray-600" />
    </div>
  );
};

export default ProfileActions;
