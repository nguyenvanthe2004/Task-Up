import type React from "react";
import Modal from "./Modal";
import { Trash2 } from "lucide-react";

interface ConfirmDeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;

  title?: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
  loading?: boolean;
}

const ConfirmDeleteModal: React.FC<ConfirmDeleteModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title = "Delete item",
  description = "Are you sure you want to delete this item? This action cannot be undone.",
  confirmText = "Delete",
  cancelText = "Cancel",
  loading = false,
}) => {
  return (
    <Modal
      isOpen={isOpen}
      title={title}
      onClose={onClose}
      onConfirm={onConfirm}
      confirmText={confirmText}
      cancelText={cancelText}
      loading={loading}
      variant="danger"
    >
      <div className="flex items-start gap-4">
        {/* Icon */}
        <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-50">
          <Trash2 size={18} className="text-red-500" />
        </div>

        {/* Content */}
        <div className="space-y-1 pt-0.5">
          <p className="text-sm text-gray-600 leading-relaxed">
            {description}
          </p>
          <p className="text-xs text-red-500/80">
            This action is permanent and cannot be reversed.
          </p>
        </div>
      </div>
    </Modal>
  );
};

export default ConfirmDeleteModal;