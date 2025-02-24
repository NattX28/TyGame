"use client";
import { Pencil } from "lucide-react";
import Link from "next/link";
import React, { useState } from "react";
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
    name: "Bob Smith",
    username: "bob.smith@email.com",
    role: "user",
    image: "https://randomuser.me/api/portraits/men/2.jpg",
    detail: "spamming",
    date: new Date("2024-01-12"),
  },
  {
    name: "Charlie Brown",
    username: "charlie.brown@email.com",
    role: "moderator",
    image: "https://randomuser.me/api/portraits/men/3.jpg",
    detail: "spamming",
    date: new Date("2023-12-15"),
  },
  {
    name: "Diana Prince",
    username: "diana.prince@email.com",
    role: "user",
    image: "https://randomuser.me/api/portraits/women/4.jpg",
    detail: "spamming",
    date: new Date("2024-02-05"),
  },
  {
    name: "Ethan Hunt",
    username: "ethan.hunt@email.com",
    role: "user",
    image: "https://randomuser.me/api/portraits/men/5.jpg",
    detail: "spamming",
    date: new Date("2024-01-25"),
  },
  {
    name: "Fiona Gallagher",
    username: "fiona.gallagher@email.com",
    role: "admin",
    image: "https://randomuser.me/api/portraits/women/6.jpg",
    detail: "spamming",
    date: new Date("2023-10-10"),
  },
  {
    name: "George Clooney",
    username: "george.clooney@email.com",
    role: "moderator",
    image: "https://randomuser.me/api/portraits/men/7.jpg",
    detail: "spamming",
    date: new Date("2024-02-08"),
  },
  {
    name: "Hannah Montana",
    username: "hannah.montana@email.com",
    role: "user",
    image: "https://randomuser.me/api/portraits/women/8.jpg",
    detail: "spamming",
    date: new Date("2023-11-30"),
  },
  {
    name: "Isaac Newton",
    username: "isaac.newton@email.com",
    role: "moderator",
    image: "https://randomuser.me/api/portraits/men/9.jpg",
    detail: "spamming",
    date: new Date("2023-12-22"),
  },
  {
    name: "Jessica Alba",
    username: "jessica.alba@email.com",
    role: "user",
    image: "https://randomuser.me/api/portraits/women/10.jpg",
    detail: "spamming",
    date: new Date("2024-01-18"),
  },
  {
    name: "Kevin Hart",
    username: "kevin.hart@email.com",
    role: "admin",
    image: "https://randomuser.me/api/portraits/men/11.jpg",
    detail: "spamming",
    date: new Date("2024-02-01"),
  },
  {
    name: "Laura Dern",
    username: "laura.dern@email.com",
    role: "user",
    image: "https://randomuser.me/api/portraits/women/12.jpg",
    detail: "spamming",
    date: new Date("2024-01-27"),
  },
  {
    name: "Michael Jordan",
    username: "michael.jordan@email.com",
    role: "moderator",
    image: "https://randomuser.me/api/portraits/men/13.jpg",
    detail: "spamming",
    date: new Date("2023-12-05"),
  },
  {
    name: "Nina Dobrev",
    username: "nina.dobrev@email.com",
    role: "user",
    image: "https://randomuser.me/api/portraits/women/14.jpg",
    detail: "spamming",
    date: new Date("2024-02-07"),
  },
  {
    name: "Oscar Wilde",
    username: "oscar.wilde@email.com",
    role: "admin",
    image: "https://randomuser.me/api/portraits/men/15.jpg",
    detail: "spamming",
    date: new Date("2024-01-20"),
  },
  {
    name: "Penelope Cruz",
    username: "penelope.cruz@email.com",
    role: "user",
    image: "https://randomuser.me/api/portraits/women/16.jpg",
    detail: "spamming",
    date: new Date("2023-11-17"),
  },
  {
    name: "Quentin Tarantino",
    username: "quentin.tarantino@email.com",
    role: "moderator",
    image: "https://randomuser.me/api/portraits/men/17.jpg",
    detail: "spamming",
    date: new Date("2023-12-30"),
  },
  {
    name: "Rachel Green",
    username: "rachel.green@email.com",
    role: "user",
    image: "https://randomuser.me/api/portraits/women/18.jpg",
    detail: "spamming",
    date: new Date("2024-01-22"),
  },
  {
    name: "Steve Jobs",
    username: "steve.jobs@email.com",
    role: "admin",
    image: "https://randomuser.me/api/portraits/men/19.jpg",
    detail: "spamming",
    date: new Date("2023-10-05"),
  },
  {
    name: "Taylor Swift",
    username: "taylor.swift@email.com",
    role: "user",
    image: "https://randomuser.me/api/portraits/women/20.jpg",
    detail: "spamming",
    date: new Date("2024-02-10"),
  },
];
// Function to format date
const formatDate = (date: Date) => {
  return date.toLocaleDateString("th-TH", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

console.log("อยู่หน้ารายชื่อ commu");

// UUID
const DetailCommunityPage = ({ param }: { param: string }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedAction, setSelectedAction] = useState("");
  const [selectedUser, setSelectedUser] = useState("");

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

  const handleDeleteCommunity = (communityId: string) => {
    // ลบ commu ใส่ทีหลัง
    console.log(`Deleting community with ID: ${communityId}`);
  };

  return (
    <div className="bg-second rounded-lg overflow-hidden">
      <div className="p-6 mx-auto">
        {/* Bulk Status Dropdown */}
        <div className="mb-6 flex justify-end gap-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant={"ghost"} className="border border-zinc-200">
                Set All Status
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
              <DropdownMenuLabel>Change All Users' Status</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuRadioGroup onValueChange={updateAllStatuses}>
                <DropdownMenuRadioItem value="pending">
                  Pending
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="banned">
                  Banned
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="kick">Kick</DropdownMenuRadioItem>
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
        <div className="md:grid md:grid-cols-5 gap-4 mb-4 text-xs font-semibold uppercase tracking-wide text-gray-400">
          <div>No.</div>
          <div>Members</div>
          <div>Date</div>
          <div>Status</div>
          <div>Edit</div>
        </div>

        {/* Table Body */}
        <div className="divide-y divide-gray-700">
          {users.map((user, index) => (
            <div
              key={user.username}
              className="py-4 space-y-3 md:space-y-0 md:grid md:grid-cols-5 md:gap-3 md:items-center">
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

              {/* Edit */}
              <div className="flex items-center justify-between">
                <Link
                  href="#"
                  onClick={() =>
                    openModal(user.username, positions[user.username])
                  }>
                  <Pencil className="w-4 h-4" />
                </Link>
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
