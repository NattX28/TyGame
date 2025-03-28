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

// make show data of uesr and useeffect update timeout banned
const AdminDeleteUserModal = ({
  onClose,
  user,
}: {
  onClose: () => void;
  user: UserFullAccess;
}) => {

  const handleConfirm = () => {
    try {
      console.log(`${user.username} has been banned`);
      user.banned = !user.banned;
      Swal.fire({
        title: "Success",
        text: `${user.username} has been deleted.`,
        icon: "success",
        timer: 3000,
        showConfirmButton: false,
            theme: 'dark'
      });
      onClose();
    } catch (error) {
      Swal.fire({
        title: "Error",
        text: "An error occurred while deleting the user. Please try again.",
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
          <h2 className="text-xl font-semibold text-center ">
            {"Delete User"}
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
              {"delete"}
            </strong>{" "}
            <p className="font-medium">{user.username} ?</p>
          </p>
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

export default AdminDeleteUserModal;
