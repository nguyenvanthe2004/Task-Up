import React from "react";
import Modal from "../ui/Modal";
import { Status } from "../../types/status";

interface BulkStatusModalProps {
  isOpen: boolean;
  statuses: Status[];
  loading?: boolean;
  onSelect: (statusId: number) => void;
  onClose: () => void;
}

const BulkStatusModal: React.FC<BulkStatusModalProps> = ({
  isOpen,
  statuses,
  loading,
  onSelect,
  onClose,
}) => (
  <Modal
    isOpen={isOpen}
    title="Change Status"
    onClose={onClose}
    showFooter={false}
    width="max-w-xs"
    loading={loading}
  >
    <div className="flex flex-col gap-0.5 -mx-1">
      {statuses.map((s) => (
        <button
          key={s.id}
          onClick={() => onSelect(s.id)}
          className="group flex items-center gap-3 w-full px-3 py-2.5 rounded-xl hover:bg-stone-50 active:scale-[0.99] transition-all text-left"
        >
          <span className="relative flex-shrink-0 flex items-center justify-center w-5 h-5">
            <span
              className="absolute w-5 h-5 rounded-full opacity-20 group-hover:opacity-30 transition-opacity"
              style={{ backgroundColor: s.color }}
            />
            <span
              className="w-2.5 h-2.5 rounded-full relative z-10"
              style={{ backgroundColor: s.color }}
            />
          </span>

          <span className="flex-1 text-[13px] font-medium text-stone-600 group-hover:text-stone-800 transition-colors">
            {s.name}
          </span>

          <svg
            viewBox="0 0 16 16"
            className="w-3.5 h-3.5 text-stone-300 group-hover:text-stone-400 opacity-0 group-hover:opacity-100 -translate-x-1 group-hover:translate-x-0 transition-all"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M3 8h10M9 4l4 4-4 4" />
          </svg>
        </button>
      ))}

      {statuses.length === 0 && (
        <div className="flex flex-col items-center justify-center py-8 gap-2">
          <div className="w-10 h-10 rounded-full bg-stone-100 flex items-center justify-center">
            <svg
              viewBox="0 0 24 24"
              className="w-5 h-5 text-stone-400"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            >
              <circle cx="12" cy="12" r="9" />
              <path d="M12 8v4M12 16h.01" />
            </svg>
          </div>
          <p className="text-[13px] text-stone-400">No statuses available</p>
        </div>
      )}
    </div>

    <div className="flex justify-end pt-3 mt-1 border-t border-stone-100">
      <button
        onClick={onClose}
        className="px-3 py-1.5 text-[13px] font-medium text-stone-500 hover:text-stone-700 hover:bg-stone-100 rounded-lg transition-all"
      >
        Cancel
      </button>
    </div>
  </Modal>
);

export default BulkStatusModal;