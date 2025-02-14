"use client";

import { useParams } from "next/navigation";
import { Pencil } from "lucide-react";
import Link from "next/link";

// Mock data
//Types
interface User {
  name: string;
  username: string;
  role: "user" | "admin" | "moderator";
  image: string;
  status: "approved" | "pending" | "denied";
  date: Date;
}
const users: User[] = [
  {
    name: "Alice Johnson",
    username: "alice.johnson@email.com",
    role: "admin",
    image: "https://randomuser.me/api/portraits/women/1.jpg",
    status: "approved",
    date: new Date("2023-11-01"),
  },
  {
    name: "Bob Smith",
    username: "bob.smith@email.com",
    role: "user",
    image: "https://randomuser.me/api/portraits/men/2.jpg",
    status: "denied",
    date: new Date("2024-01-12"),
  },
  {
    name: "Charlie Brown",
    username: "charlie.brown@email.com",
    role: "moderator",
    image: "https://randomuser.me/api/portraits/men/3.jpg",
    status: "approved",
    date: new Date("2023-12-15"),
  },
  {
    name: "Diana Prince",
    username: "diana.prince@email.com",
    role: "user",
    image: "https://randomuser.me/api/portraits/women/4.jpg",
    status: "approved",
    date: new Date("2024-02-05"),
  },
  {
    name: "Ethan Hunt",
    username: "ethan.hunt@email.com",
    role: "user",
    image: "https://randomuser.me/api/portraits/men/5.jpg",
    status: "denied",
    date: new Date("2024-01-25"),
  },
  {
    name: "Fiona Gallagher",
    username: "fiona.gallagher@email.com",
    role: "admin",
    image: "https://randomuser.me/api/portraits/women/6.jpg",
    status: "approved",
    date: new Date("2023-10-10"),
  },
  {
    name: "George Clooney",
    username: "george.clooney@email.com",
    role: "moderator",
    image: "https://randomuser.me/api/portraits/men/7.jpg",
    status: "denied",
    date: new Date("2024-02-08"),
  },
  {
    name: "Hannah Montana",
    username: "hannah.montana@email.com",
    role: "user",
    image: "https://randomuser.me/api/portraits/women/8.jpg",
    status: "approved",
    date: new Date("2023-11-30"),
  },
  {
    name: "Isaac Newton",
    username: "isaac.newton@email.com",
    role: "moderator",
    image: "https://randomuser.me/api/portraits/men/9.jpg",
    status: "approved",
    date: new Date("2023-12-22"),
  },
  {
    name: "Jessica Alba",
    username: "jessica.alba@email.com",
    role: "user",
    image: "https://randomuser.me/api/portraits/women/10.jpg",
    status: "denied",
    date: new Date("2024-01-18"),
  },
  {
    name: "Kevin Hart",
    username: "kevin.hart@email.com",
    role: "admin",
    image: "https://randomuser.me/api/portraits/men/11.jpg",
    status: "approved",
    date: new Date("2024-02-01"),
  },
  {
    name: "Laura Dern",
    username: "laura.dern@email.com",
    role: "user",
    image: "https://randomuser.me/api/portraits/women/12.jpg",
    status: "denied",
    date: new Date("2024-01-27"),
  },
  {
    name: "Michael Jordan",
    username: "michael.jordan@email.com",
    role: "moderator",
    image: "https://randomuser.me/api/portraits/men/13.jpg",
    status: "approved",
    date: new Date("2023-12-05"),
  },
  {
    name: "Nina Dobrev",
    username: "nina.dobrev@email.com",
    role: "user",
    image: "https://randomuser.me/api/portraits/women/14.jpg",
    status: "approved",
    date: new Date("2024-02-07"),
  },
  {
    name: "Oscar Wilde",
    username: "oscar.wilde@email.com",
    role: "admin",
    image: "https://randomuser.me/api/portraits/men/15.jpg",
    status: "denied",
    date: new Date("2024-01-20"),
  },
  {
    name: "Penelope Cruz",
    username: "penelope.cruz@email.com",
    role: "user",
    image: "https://randomuser.me/api/portraits/women/16.jpg",
    status: "approved",
    date: new Date("2023-11-17"),
  },
  {
    name: "Quentin Tarantino",
    username: "quentin.tarantino@email.com",
    role: "moderator",
    image: "https://randomuser.me/api/portraits/men/17.jpg",
    status: "approved",
    date: new Date("2023-12-30"),
  },
  {
    name: "Rachel Green",
    username: "rachel.green@email.com",
    role: "user",
    image: "https://randomuser.me/api/portraits/women/18.jpg",
    status: "denied",
    date: new Date("2024-01-22"),
  },
  {
    name: "Steve Jobs",
    username: "steve.jobs@email.com",
    role: "admin",
    image: "https://randomuser.me/api/portraits/men/19.jpg",
    status: "approved",
    date: new Date("2023-10-05"),
  },
  {
    name: "Taylor Swift",
    username: "taylor.swift@email.com",
    role: "user",
    image: "https://randomuser.me/api/portraits/women/20.jpg",
    status: "approved",
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

const getStatusColor = (status: User["status"]) => {
  switch (status) {
    case "approved":
      return "text-green-700 bg-green-100 dark:text-green-100 dark:bg-green-800";
    case "pending":
      return "text-orange-700 bg-orange-100 dark:text-orange-100 dark:bg-orange-800";
    case "denied":
      return "text-red-700 bg-red-100 dark:text-red-100 dark:bg-red-800";
  }
};

const page = () => {
  const { uuid } = useParams();

  return (
    // table
    <div className="bg-second rounded-lg overflow-hidden">
      <div className="p-6">
        <div className="md:grid md:grid-cols-5 gap-4 mb-4 text-xs font-semibold uppercase tracking-wide text-gray-400">
          <div>No.</div>
          <div>Members</div>
          <div>Date</div>
          <div>Status</div>
          <div>Edit</div>
        </div>
        {/* table body */}
        <div className="divide-y divide-gray-700">
          {users.map((user, index) => (
            <div
              key={index}
              className="py-4 space-y-3 md:space-y-0 md:grid md:grid-cols-5 md:gap-3 md:items-center">
              {/* Number*/}
              <div className="flex items-center justify-between md:block">
                <span className="text-sm font-medium text-gray-500 dark:text-gray-400 md:hidden">
                  No:
                </span>
                <span className="text-sm text-white">{index + 1}</span>
              </div>
              {/* user info (row display) */}
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
              <div className="flex items-center justify-between md:block">
                <span className="text-sm font-medium text-gray-500 dark:text-gray-400 md:hidden">
                  Date:
                </span>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {formatDate(user.date)}
                </span>
              </div>

              {/* Status */}
              <div className="flex items-center justify-between md:block">
                <span className="text-sm font-medium text-gray-400 md:hidden">
                  Status:
                </span>
                <span
                  className={`px-2 py-1 text-xs rounded-full ${getStatusColor(
                    user.status
                  )}`}>
                  {user.status}
                </span>
              </div>

              {/* Edit */}
              <div className="flex items-center justify-between ">
                <Link href="#">
                  <Pencil className="w-4 h-4" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
export default page;
