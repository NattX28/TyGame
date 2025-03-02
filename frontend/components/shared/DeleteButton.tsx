import { Trash2 } from "lucide-react";
import { useState } from "react";
import { DeleteButtonProps } from "@/types/ui";
import { Button } from "../ui/button";
const DeleteButton = ({
  itemId,
  itemType,
  onDelete,
  buttonText,
  modalTitle,
  modalDescription,
}: DeleteButtonProps) => {
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Default text values based on item type
  const defaultButtonText =
    itemType === "community" ? "Delete Community" : "Delete Friend";
  const defaultModalTitle = "Are you absolutely sure?";
  const defaultModalDescription =
    itemType === "community"
      ? "This action cannot be undone. This will permanently delete the community and remove all associated data."
      : "This action cannot be undone. This will permanently remove this friend from your list.";

  // Use provided text or defaults
  const finalButtonText = buttonText || defaultButtonText;
  const finalModalTitle = modalTitle || defaultModalTitle;
  const finalModalDescription = modalDescription || defaultModalDescription;

  const handleDelete = () => {
    onDelete(itemId);
    setShowDeleteModal(false);
  };

  return (
    <>
      <Button onClick={() => setShowDeleteModal(true)}>
        <Trash2 className="w-4 h-4" />
        {finalButtonText}
      </Button>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-second text-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-2">{finalModalTitle}</h3>
            <p className="text-gray-400 mb-4">{finalModalDescription}</p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 border border-gray-600 rounded-md hover:bg-gray-700 transition-colors">
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-600 rounded-md hover:bg-red-700 transition-colors">
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default DeleteButton;
