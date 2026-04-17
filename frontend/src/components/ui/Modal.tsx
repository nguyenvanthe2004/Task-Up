import type React from "react";
import { X, Loader2 } from "lucide-react";

interface ModalProps {
  isOpen: boolean;
  title?: string;
  children: React.ReactNode;
  onClose: () => void;
  onConfirm?: () => void;
  confirmText?: string;
  cancelText?: string;
  showFooter?: boolean;
  width?: string;
  loading?: boolean;
  disabled?: boolean,
  variant?: "default" | "danger" | "success";
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  title,
  children,
  onClose,
  onConfirm,
  confirmText = "Confirm",
  cancelText = "Cancel",
  showFooter = true,
  width = "max-w-md",
  loading = false,
  variant = "default",
}) => {
  if (!isOpen) return null;

  const variantStyles = {
    default: "bg-blue-600 hover:bg-blue-700 focus:ring-blue-500",
    danger: "bg-red-600 hover:bg-red-700 focus:ring-red-500",
    success: "bg-green-600 hover:bg-green-700 focus:ring-green-500",
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      {/* Overlay với animation mượt mà */}
      <div
        className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm transition-opacity duration-300"
        onClick={!loading ? onClose : undefined}
        aria-hidden="true"
      />

      {/* Modal Container */}
      <div
        className={`relative z-10 w-full ${width} transform transition-all duration-300 ease-out`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        <div className="overflow-hidden rounded-xl bg-white shadow-2xl ring-1 ring-gray-900/5">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
            <h3
              id="modal-title"
              className="text-lg font-semibold tracking-tight text-gray-900"
            >
              {title}
            </h3>

            <button
              onClick={onClose}
              disabled={loading}
              className="group rounded-lg p-1.5 text-gray-400 transition-all hover:bg-gray-100 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-200 disabled:cursor-not-allowed disabled:opacity-50"
              aria-label="Close modal"
            >
              <X size={20} className="transition-transform group-hover:scale-110" />
            </button>
          </div>

          {/* Body */}
          <div className="px-6 py-5 text-gray-600">
            {children}
          </div>

          {/* Footer */}
          {showFooter && (
            <div className="flex justify-end gap-3 border-t border-gray-100 bg-gray-50/50 px-6 py-4">
              <button
                onClick={onClose}
                disabled={loading}
                className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm transition-all hover:bg-gray-50 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-200 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {cancelText}
              </button>

              {onConfirm && (
                <button
                  onClick={onConfirm}
                  disabled={loading}
                  className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-white shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60 ${variantStyles[variant]}`}
                >
                  {loading && (
                    <Loader2 size={16} className="animate-spin" />
                  )}
                  {confirmText}
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Modal;