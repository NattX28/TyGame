import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { UserFullAccess } from "@/types/types";
import Swal from "sweetalert2";
import { banUser, unbanUser } from "@/services/user/admin";

// make show data of uesr and useeffect update timeout banned
const AdminBanUserModal = ({
  onClose,
  user,
}: {
  onClose: () => void;
  user: UserFullAccess;
}) => {
  const [banReason, setBanReason] = useState("");
  const [banDuration, setBanDuration] = useState("");
  const [username, setUsername] = useState(user.username);

  useEffect(() => {
    if (user.banned && user.timestamp) {
      const timeout = setTimeout(() => {
        alert(`${username}'s ban has expired.`);
      }, user.timestamp * 1000 - Date.now());
      return () => clearTimeout(timeout);
    }
  }, [user, username]);

  const handleConfirm = async () => {
    try {
      if (!user.banned) {
        const duration = parseInt(banDuration, 10);
        if (!isNaN(duration) && duration >= 1) {
          const form = {
            userid: user.id,
            reason: banReason,
            timestamp: Math.floor(Date.now() / 1000) + duration * 24 * 60 * 60,
          }
          await banUser(form);
          user.banned = true;
          user.reason = form.reason;
          user.timestamp = form.timestamp
          Swal.fire({
            title: "Success",
            text: `${username} has been banned for ${duration} days.`,
            icon: "success",
            timer: 3000,
            showConfirmButton: false,
            theme: 'dark'
          });
        } else {
          Swal.fire({
            title: "Invalid Input",
            text: "Please enter a valid ban duration.",
            icon: "warning",
            timer: 3000,
            showConfirmButton: false,
            theme: 'dark'
          });
          return;
        }
      } else {
        await unbanUser(user.id);
        user.banned = false;
        Swal.fire({
          title: "Success",
          text: `${username} has been unbanned.`,
          icon: "success",
          timer: 3000,
          showConfirmButton: false,
            theme: 'dark'
        });
      }
      onClose();
    } catch (error) {
      Swal.fire({
        title: "Error",
        text: "An error occurred while updating the ban status. Please try again.",
        icon: "error",
        timer: 3000,
        showConfirmButton: false,
            theme: 'dark'
      });
      console.error(error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <Card className="w-full max-w-md mx-4">
        <CardHeader className="relative border-b text-white">
          <h2 className="text-xl font-semibold text-center">
            {user.banned ? "Unban User" : "Ban User"}
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
          <p className="text-center">
            Are you sure you want to{" "}
            <strong className="text-red-600">
              {user.banned ? "unban" : "ban"}
            </strong>{" "}
            <p className="font-medium">{username} ?</p>
          </p>

          {!user.banned && (
            <div>
              <label className="block text-sm font-medium mb-1">
                Ban Duration (days) :
              </label>
              <input
                type="number"
                className="w-full p-2 border rounded-md bg-second"
                value={banDuration}
                onChange={(e) => setBanDuration(e.target.value)}
                min="1"
              />
              <label className="block text-sm font-medium mt-2 mb-1">
                Reason :
              </label>
              <input
                type="text"
                className="w-full p-2 border rounded-md bg-second"
                value={banReason}
                onChange={(e) => setBanReason(e.target.value)}
              />
            </div>
          )}
        </CardContent>

        <CardFooter className="flex text-white justify-end space-x-2 p-4 border-t">
          <Button
            variant="ghost"
            className="border border-zinc-800"
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={() => {
              handleConfirm();
            }}
          >
            Confirm
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default AdminBanUserModal;
