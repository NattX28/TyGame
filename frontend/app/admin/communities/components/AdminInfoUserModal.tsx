import React, { useEffect, useState } from "react";
import moment from "moment";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { UserFullAccess } from "@/types/types";

const AdminInfoUserModal = ({
  onClose,
  user,
}: {
  onClose: () => void;
  user: UserFullAccess;
}) => {
  const [remainingTime, setRemainingTime] = useState<string | null>(null);

  useEffect(() => {
    const updateRemainingTime = () => {
      if (user.timestamp) {
        const now = moment();
        const userTime = moment.unix(user.timestamp);
        const diff = userTime.diff(now);

        if (diff > 0) {
          setRemainingTime(userTime.fromNow());
        } else {
          setRemainingTime("Expired");
        }
      } else {
        setRemainingTime(null);
      }
    };

    updateRemainingTime();
    const interval = setInterval(updateRemainingTime, 1000);

    return () => clearInterval(interval);
  }, [user.timestamp]);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <Card className="w-full max-w-md mx-4">
        <CardHeader className="relative border-b text-white">
          <h2 className="text-xl font-semibold text-center">
            User Information
          </h2>
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-2 top-2"
            onClick={onClose}
          >
            ✕
          </Button>
        </CardHeader>

        <CardContent className="p-4 space-y-4 text-white">
          <div>
            <p className="font-medium">Name:</p>
            <p>{user.name}</p>
          </div>
          <div>
            <p className="font-medium">Username:</p>
            <p>{user.username}</p>
          </div>
          <div>
            <p className="font-medium">Role:</p>
            <p>{user.role || "N/A"}</p>
          </div>
          <div>
            <p className="font-medium">Banned:</p>
            <p>{user.banned ? "Yes" : "No"}</p>
          </div>
          {user.banned && (
            <>
              <div>
                <p className="font-medium">Reason:</p>
                <p>{user.reason || "N/A"}</p>
              </div>
              <div>
                <p className="font-medium">Ban Expires:</p>
                <p>{remainingTime || "N/A"}</p>
              </div>
            </>
          )}
          <div>
            <p className="font-medium">Description:</p>
            <p>{user.description || "N/A"}</p>
          </div>
        </CardContent>

        <CardFooter className="flex justify-end space-x-2 p-4 border-t">
          <Button
            variant="ghost"
            className="border border-zinc-800 text-white"
            onClick={onClose}
          >
            Close
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default AdminInfoUserModal;
