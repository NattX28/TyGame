export interface DeleteButtonProps {
  itemId: string;
  itemType: "community" | "friend";
  onDelete: (id: string) => void;
  buttonText?: string;
  modalTitle?: string;
  modalDescription?: string;
}
