"use client";
import moment from 'moment';
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
import DeleteButton from "@/components/shared/DeleteButton";
import { deleteCommunity, getCommunity, getCommunityMember } from "@/services/community/communities";
import Swal from "sweetalert2";
import { useParams, useRouter } from "next/navigation";
import { Community, UserFullAccess } from "@/types/types";
import { getUserImage } from '@/services/user/user';
import AdminBanUserModal from "../components/AdminBanUserModal";
import AdminDeleteUserModal from "../components/AdminDeleteUserModal";
import AdminInfoUserModal from "../components/AdminInfoUserModal";
import { getUsersData } from '@/services/user/admin';

// UUID
const DetailCommunityPage = ({ param }: { param: string }) => {
  const router = useRouter();

  const [banModelOpen, setBanModelOpen] = useState<UserFullAccess | null>(null);
  const [delModelOpen, setDelModelOpen] = useState<UserFullAccess | null>(null);
  const [infoModelOpen, setInfoModelOpen] = useState<UserFullAccess | null>(null);
  const [users, setUsers] = useState<UserFullAccess[]>([])
  const [usersFilter, setUsersFilter] = useState<UserFullAccess[]>([])

  const [community, setCommunity] = useState<Community|null>();
  const idCommunity = useParams().id as string;
  useEffect(() => {
    const fetchData = async () => {
      if (idCommunity) {
        try {
          const commu = await getCommunity(idCommunity);
          const userids = await getCommunityMember(commu.uuid)
          const users = await getUsersData(userids);
          setCommunity(commu);
          setUsers(users)
          setUsersFilter(users);
        } catch (error) {
          console.error("Failed to fetch community", error);
        }
      }
    };
  
    fetchData();
  }, []);

  const handleDeleteCommunity = async (communityId: string) => {
    try {
      const response = await deleteCommunity(communityId);
      Swal.fire({
        title: "Correct",
        text: `Delete Community: ${communityId} Success`,
        icon: "success",
        timer: 3000,
        showConfirmButton: false,
            theme: 'dark'
      });
      console.log("delete community : ", communityId);
      console.log(response);
      router.push("/admin/communities");
    } catch (error: any) {
      Swal.fire({
        title: "Error",
        text: error?.message || "An error occurred while deleting the community.",
        icon: "error",
        timer: 3000,
        showConfirmButton: false,
            theme: 'dark'
      });
      console.error("Failed to delete community", error);
    }
  };

  return (
    <div className="rounded-lg overflow-hidden w-full mx-auto">
      <div className="px-10 mx-auto my-10">
        {/* Bulk Status Dropdown */}
        <div className="flex justify-end gap-4 text-main-color items-center">
          <strong className='mr-auto text-3xl'>
            Community <span className='text-red-600'>{`| ${community?.name}`}</span>
          </strong>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant={"ghost"} className="border border-zinc-200">
                Filter
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-40 bg-forth">
              {/* <DropdownMenuLabel>Filter</DropdownMenuLabel>
              <DropdownMenuSeparator /> */}
              <DropdownMenuRadioGroup 
                onValueChange={(status) => {
                  setUsersFilter(
                    status === "All" ?
                    users : users.filter((user) => 
                      (status === "Normal" && !user.banned) || 
                      (status === "Banned" && user.banned)
                    )
                  );
                }}  
                className="text-center"
              >
                <DropdownMenuRadioItem value="All" className="text-main-color">
                  All
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="Normal" className="text-main-color">
                  Normal
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="Banned" className="text-main-color">
                  Banned
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
        <div className="grid grid-cols-[30%_15%_15%_40%] gap-4 mt-10 mb-4 text-xs font-semibold uppercase tracking-wide text-gray-400">
          <div>Username</div>
          <div>Status</div>
          <div>Timeout</div>
          <div>Action</div>
        </div>

        {/* Table Body */}
        <div className="divide-y divide-gray-700">
          {usersFilter.map((user, index) => (
            <div
              key={index}
              className="py-4 space-y-3 md:space-y-0 grid grid-cols-[30%_15%_15%_40%] gap-4 md:items-center">
              {/* Number */}

              {/* User Info */}
              <div className="flex items-center">
                <img
                  src={getUserImage(user.id)}
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

              { user.banned ? (
                <div className={`text-sm font-medium text-red-600`}>
                  {"Banned"}
                </div>
              ) : (
                <div className={`text-sm font-medium text-green-600`}>
                  {"Normal"}
                </div>
              )}

              {/* Date */}
              <div className="text-sm text-gray-500 dark:text-gray-400">
                {user.banned && user.timestamp && moment.unix(user.timestamp).fromNow()}
              </div>

              {/* Status Dropdown */}
              <div className='flex items-center gap-4'>
                <Button
                  variant={"ghost"}
                  className="border border-red-600"
                  onClick={() => {
                    setInfoModelOpen(user);
                  }}
                >
                  {"Info"}
                </Button>
                { user.banned ? (
                  <Button
                    variant={"ghost"}
                    className="border border-red-600"
                    onClick={() => {
                      setBanModelOpen(user);
                    }}
                  >
                    {"Unban"}
                  </Button>
                ) : (
                  <Button
                    variant={"ghost"}
                    className="border border-red-600"
                    onClick={() => {
                      setBanModelOpen(user);
                    }}
                  >
                    {"Ban"}
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal */}
      {infoModelOpen && (
        <AdminInfoUserModal
          onClose={() => setInfoModelOpen(null)}
          user={infoModelOpen}
        />
      )}
      {banModelOpen && (
        <AdminBanUserModal
          onClose={() => setBanModelOpen(null)}
          user={banModelOpen}
        />
      )}
      {delModelOpen && (
        <AdminDeleteUserModal
          onClose={() => setDelModelOpen(null)}
          user={delModelOpen}
        />
      )}
    </div>
  );
};
export default DetailCommunityPage;
