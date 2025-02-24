import { Trash2 } from "lucide-react";
import { useState } from "react";

const DetailCommunityPage = ({
  params,
  text,
}: {
  params: { id: string };
  text: string;
}) => {
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const handleDeleteCommunity = () => {
    // ลบ commu ใส่ทีหลัง

    console.log(`Deleting community with ID: ${params.id}`);
  };

  return (
    <div className="mt-2 bg-second rounded-lg overflow-hidden">
      {/* Add Delete Community Button at the top */}
      <div className="flex justify-between items-center">
        <button
          onClick={() => setShowDeleteModal(true)}
          className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-md transition-colors">
          <Trash2 className="w-4 h-4" />
          Delete Community
        </button>
      </div>

      {/* Tailwind Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-second text-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-2">
              Are you absolutely sure?
            </h3>
            <p className="text-gray-400 mb-4">
              This action cannot be undone. This will permanently delete the
              community and remove all associated data.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 border border-gray-600 rounded-md hover:bg-gray-700 transition-colors">
                Cancel
              </button>
              <button
                onClick={handleDeleteCommunity}
                className="px-4 py-2 bg-red-600 rounded-md hover:bg-red-700 transition-colors">
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DetailCommunityPage;
