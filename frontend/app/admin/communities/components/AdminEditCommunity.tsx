"use client";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Swal from "sweetalert2";
import { editCommunity } from "@/services/community/communities"; // API function
import { listAllCommunities } from "@/services/community/communities"; // API to get communities list
import { X } from "lucide-react";
import { Community } from "@/types/types";

const AdminEditCommunity = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [communities, setCommunities] = useState<Community[]>();
  const [selectedCommunity, setSelectedCommunity] = useState<any | null>(null);

  useEffect(() => {
    // Fetch all communities for dropdown
    const loadCommunities = async () => {
      try {
        const response = await listAllCommunities();
        setCommunities(response);
      } catch (error: any) {
        Swal.fire("ERROR!!", error?.message, "error");
      }
    };
    loadCommunities();
  }, []);

  // Update community state for editable fields
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    if (selectedCommunity) {
      setSelectedCommunity({
        ...selectedCommunity,
        [e.target.name]: e.target.value,
      });
    }
  };

  const handleEditCommunity = async () => {
    if (!selectedCommunity) {
      Swal.fire("Error", "Please select a community to edit.", "error");
      return;
    }

    setLoading(true);
    try {
      await editCommunity(selectedCommunity.id);
      Swal.fire("Success", "Community updated successfully!", "success");
      setIsOpen(false);
    } catch (error: any) {
      Swal.fire("Error", error?.message, "error");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="mx-6 mt-8">
      <Button onClick={() => setIsOpen(true)}>Edit Community</Button>

      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-second text-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold mb-4">Edit Community</h3>

            {/* Step 1: Choose Community */}
            <div>
              <label className="block text-sm font-medium mb-1">
                Select Community:
              </label>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button className="w-full text-black bg-white">
                    {selectedCommunity
                      ? selectedCommunity.name
                      : "Choose Community"}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-full">
                  {communities.map((community) => (
                    <div
                      key={community.uuid}
                      className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-black"
                      onClick={() => setSelectedCommunity(community)}>
                      {community.name}
                    </div>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {selectedCommunity && (
              <>
                {/* Step 2: Edit Details (excluding category & image) */}
                <div className="mt-4">
                  <label className="block text-sm font-medium mb-1">
                    Community Name:
                  </label>
                  <input
                    type="text"
                    name="name"
                    className="w-full p-2 border rounded-md text-black mb-2"
                    value={selectedCommunity.name}
                    onChange={handleInputChange}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Description:
                  </label>
                  <textarea
                    name="description"
                    className="w-full p-2 border rounded-md text-black mb-2 max-h-40"
                    value={selectedCommunity.description}
                    onChange={handleInputChange}
                  />
                </div>

                {/* Buttons */}
                <div className="flex justify-end space-x-3 mt-4">
                  <button
                    onClick={() => setIsOpen(false)}
                    className="px-4 py-2 border border-gray-600 rounded-md hover:bg-gray-700 transition-colors">
                    Cancel
                  </button>
                  <button
                    onClick={handleEditCommunity}
                    className="px-4 py-2 bg-blue-600 rounded-md hover:bg-blue-700 transition-colors"
                    disabled={loading}>
                    {loading ? "Updating..." : "Save Changes"}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminEditCommunity;
