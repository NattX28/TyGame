import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";

const AdminCommunityModal = ({
  action,
  isOpen,
  onClose,
  username,
}: {
  action: string;
  isOpen: boolean;
  onClose: () => void;
  username: string;
}) => {
  const [banDuration, setBanDuration] = useState("");

  useEffect(()=>{
    if(isOpen){
        setBanDuration("");
    }
  },[isOpen,action])
  
  const handleConfirm = () => {
    if (action === "banned" && !banDuration.trim()) {
      alert("Please specify the ban duration.");
      return;
    }
    console.log(`${username} has been ${action} ${banDuration ? `for ${banDuration} days` : ""}`);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/5 flex items-center justify-center z-50">
      <Card className="w-full max-w-md mx-4">
        <CardHeader className="relative border-b">
          <h2 className="text-xl font-semibold text-center">
            {action === "banned" ? "Ban User" : "Kick User"}
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

        <CardContent className="p-4 space-y-4">
          <p className="text-center text-gray-700">
            Are you sure you want to <strong className="text-red-600">{action}</strong> <strong>{username}</strong>?
          </p>

          {action === "banned" && (
            <div>
              <label className="block text-sm font-medium mb-1">Ban Duration (days):</label>
              <input
                type="number"
                className="w-full p-2 border rounded-md"
                value={banDuration}
                onChange={(e) => setBanDuration(e.target.value)}
                min="1"
              />
            </div>
          )}
        </CardContent>

        <CardFooter className="flex justify-end space-x-2 p-4 border-t">
          <Button variant="ghost" className="border border-zinc-800" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={()=>{handleConfirm();}}>
            Confirm
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default AdminCommunityModal;
