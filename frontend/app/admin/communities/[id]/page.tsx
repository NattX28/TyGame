"use client";
import { Pencil } from "lucide-react";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import AdminModal from "../components/AdminCommunityModal";
import DeleteButton from "@/components/shared/DeleteButton";
import { deleteCommunity, getCommunity } from "@/services/community/communities";
import Swal from "sweetalert2";
import { useParams, useRouter } from "next/navigation";
import { Community } from "@/types/types";

// Mock data
//Types
interface User {
  name: string;
  username: string;
  role: "user" | "admin" | "moderator";
  image: string;
  detail: string;
  date: Date;
}
const users: User[] = [
  {
    name: "Alice Johnson",
    username: "alice.johnson@email.com",
    role: "admin",
    image: "https://randomuser.me/api/portraits/women/1.jpg",
    detail: "spamming",
    date: new Date("2023-11-01"),
  },
  {
    name: "Alice Johnson",
    username: "alice.johnson@email.com",
    role: "admin",
    image: "https://randomuser.me/api/portraits/women/1.jpg",
    detail: "spamming",
    date: new Date("2023-11-01"),
  },
  {
    name: "Alice Johnson",
    username: "alice.johnson@email.com",
    role: "admin",
    image: "https://randomuser.me/api/portraits/women/1.jpg",
    detail: "spamming",
    date: new Date("2023-11-01"),
  }
]

console.log("อยู่หน้ารายชื่อ commu");

// UUID
const DetailCommunityPage = ({ param }: { param: string }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedAction, setSelectedAction] = useState("");
  const [selectedUser, setSelectedUser] = useState("");
  const router = useRouter();

  const [community, setCommunity] = useState<Community|null>();
  const idCommunity = useParams().id as string;
  useEffect(() => {
    const fetchCommunity = async () => {
      if (idCommunity) {
        try {
          const commu = await getCommunity(idCommunity);
          setCommunity(commu);
        } catch (error) {
          console.error("Failed to fetch community");
        }
      }
    };
  
    fetchCommunity();
  }, [idCommunity]);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("th-TH", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const openModal = (username: string, action: string) => {
    if (action !== "pending") {
      setSelectedUser(username);
      setSelectedAction(action);
      setIsOpen(true);
    }
  };

  // Create Object to store status (PK -> username)
  const [positions, setPositions] = useState(() =>
    users.reduce((acc, user) => {
      acc[user.username] = "pending";
      return acc;
    }, {} as Record<string, string>)
  );

  // Function to update a specific user's status
  const updatePosition = (userId: string, newPosition: string) => {
    setPositions((prev) => ({
      ...prev,
      [userId]: newPosition,
    }));
  };

  // Function to update all statuses at once
  const updateAllStatuses = (newPosition: string) => {
    setPositions((prev) =>
      Object.keys(prev).reduce((acc, username) => {
        acc[username] = newPosition;
        return acc;
      }, {} as Record<string, string>)
    );
  };

  const handleDeleteCommunity = async (communityId: string) => {
    // ลบ commu ใส่ทีหลัง
    try {
      const response = await deleteCommunity(communityId);
      Swal.fire(
        "Correct",
        `Delete Community: ${communityId} Success`,
        "success"
      );
      console.log("delete community : ", communityId);
      console.log(response);
      router.push("/admin/communities");
    } catch (error: any) {
      Swal.fire({
        title: "ERROR!!",
        text: error?.message,
        icon: "error",
      });
    }
  };

  return (
    <div className="rounded-lg overflow-hidden w-full max-w-5xl mx-auto">
      <div className="px-10 mx-auto my-10">
        {/* Bulk Status Dropdown */}
        <div className="flex justify-end gap-4 text-main-color">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant={"ghost"} className="border border-zinc-200">
                Filter
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-40 bg-forth">
              {/* <DropdownMenuLabel>Filter</DropdownMenuLabel>
              <DropdownMenuSeparator /> */}
              <DropdownMenuRadioGroup onValueChange={updateAllStatuses}  className="text-center">
                <DropdownMenuRadioItem value="all" className="text-main-color">
                  All User
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="banned" className="text-main-color">
                  Banned User
                </DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>
          <DeleteButton
            itemId={param}
            itemType="community"
            onDelete={handleDeleteCommunity}
          />
        </div>

        {/* Table Header */}
        <div className="grid grid-cols-[10%_50%_25%_25%] gap-4 mt-10 mb-4 text-xs font-semibold uppercase tracking-wide text-gray-400">
          <div>No.</div>
          <div>Username</div>
          <div>Timeout</div>
          <div>Action</div>
        </div>

        {/* Table Body */}
        <div className="divide-y divide-gray-700">
          {users.map((user, index) => (
            <div
              key={user.username}
              className="py-4 space-y-3 md:space-y-0 grid grid-cols-[10%_50%_25%_25%] gap-4 md:items-center">
              {/* Number */}
              <div className="text-sm text-white">{index + 1}</div>

              {/* User Info */}
              <div className="flex items-center">
                <img
                  src={user.image}
                  alt={user.name}
                  className="h-8 w-8 rounded-full"
                />
                <div className="ml-3">
                  <p className="text-sm font-medium text-main-color">
                    {user.name}
                  </p>
                  <p className="text-sm text-gray-400">{user.username}</p>
                </div>
              </div>

              {/* Date */}
              <div className="text-sm text-gray-500 dark:text-gray-400">
                {formatDate(user.date)}
              </div>

              {/* Status Dropdown */}
              <div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant={"ghost"} className="border border-red-600">
                      {positions[user.username]}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56">
                    <DropdownMenuLabel>Permission :</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuRadioGroup
                      value={positions[user.username]}
                      onValueChange={(value) =>
                        updatePosition(user.username, value)
                      }>
                      <DropdownMenuRadioItem value="banned">
                        Banned
                      </DropdownMenuRadioItem>
                      <DropdownMenuRadioItem value="kick">
                        Kick
                      </DropdownMenuRadioItem>
                    </DropdownMenuRadioGroup>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          ))}
        </div>

        {selectedUser && selectedAction && (
          <AdminModal
            isOpen={isOpen}
            onClose={() => setIsOpen(false)}
            username={selectedUser}
            action={selectedAction}
          />
        )}
      </div>
    </div>
  );
};
export default DetailCommunityPage;
