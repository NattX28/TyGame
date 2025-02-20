import { Button } from "@/components/ui/button";

interface ProfileActionsProps {
  username: string;
}

const ProfileActions = ({ username }: ProfileActionsProps) => {
  return (
    <div className="flex items-center gap-4">
      <h1 className="text-xl font-semibold"> {username} </h1>
      <Button className="rounded-sm" size={"sm"}>
        Edit Profile
      </Button>
    </div>
  );
};

export default ProfileActions;
