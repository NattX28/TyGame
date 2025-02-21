import { Button } from "@/components/ui/button";
import { UserRoundPlus, Settings } from "lucide-react";

const ProfileActions = ({
  username,
  btnText,
  btnIcon,
}: {
  username: string;
  btnText: string;
  btnIcon: string;
}) => {
  return (
    <div className="flex items-center gap-6">
      <h1 className="text-xl font-semibold"> {username} </h1>
      <Button className="rounded-md" size={"sm"}>
        {/* in the future we will change this state when added friend from add
        friend to delete this friend. */}
        {btnIcon === "Settings" ? <Settings /> : <UserRoundPlus />}
        {btnText}
      </Button>
    </div>
  );
};

export default ProfileActions;
