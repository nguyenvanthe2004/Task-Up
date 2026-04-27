import React, { useEffect, useRef } from "react";
import Modal from "../ui/Modal";
import { Member } from "../../types/task";
import { normalizeImg } from "../../lib/until";

interface BulkAssignModalProps {
  isOpen: boolean;
  members: Member[];
  loading?: boolean;
  onSelect: (memberId: number[]) => void;
  onClose: () => void;
}

const BulkAssignModal: React.FC<BulkAssignModalProps> = ({
  isOpen,
  members,
  loading,
  onSelect,
  onClose,
}) => {
  const [selectedIds, setSelectedIds] = React.useState<Set<number>>(new Set());
  const [search, setSearch] = React.useState("");
  const searchRef = useRef<HTMLInputElement>(null);

  const toggleMember = (id: number) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const filteredMembers = members.filter((m) =>
    m.fullName.toLowerCase().includes(search.toLowerCase())
  );

  useEffect(() => {
    if (isOpen) {
      setSelectedIds(new Set());
      setSearch("");
      setTimeout(() => searchRef.current?.focus(), 100);
    }
  }, [isOpen]);

  const allSelected =
    filteredMembers.length > 0 &&
    filteredMembers.every((m) => selectedIds.has(m.id));

  const toggleAll = () => {
    if (allSelected) {
      setSelectedIds((prev) => {
        const next = new Set(prev);
        filteredMembers.forEach((m) => next.delete(m.id));
        return next;
      });
    } else {
      setSelectedIds((prev) => {
        const next = new Set(prev);
        filteredMembers.forEach((m) => next.add(m.id));
        return next;
      });
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      title="Assign Members"
      onClose={onClose}
      showFooter={false}
      width="max-w-sm"
      loading={loading}
    >
      <div className="flex flex-col gap-3">
        {filteredMembers.length > 1 && (
          <button
            onClick={toggleAll}
            className="flex items-center gap-2 px-1 py-0.5 text-[12px] text-stone-400 hover:text-indigo-500 transition-colors w-fit"
          >
            <span
              className={`w-4 h-4 rounded border flex items-center justify-center transition-all ${
                allSelected
                  ? "bg-indigo-500 border-indigo-500"
                  : "border-stone-300 bg-white"
              }`}
            >
              {allSelected && (
                <svg viewBox="0 0 10 10" className="w-2.5 h-2.5" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M1.5 5l2.5 2.5 4.5-4.5" />
                </svg>
              )}
            </span>
            {allSelected ? "Deselect all" : "Select all"}
          </button>
        )}

        {/* Member list */}
        <div className="flex flex-col gap-0.5 -mx-1 max-h-60 overflow-y-auto pr-0.5 scrollbar-thin scrollbar-thumb-stone-200 scrollbar-track-transparent">
          {filteredMembers.map((m) => {
            const isSelected = selectedIds.has(m.id);
            return (
              <button
                key={m.id}
                onClick={() => toggleMember(m.id)}
                className={`group flex items-center gap-3 w-full px-3 py-2.5 rounded-xl transition-all text-left ${
                  isSelected
                    ? "bg-indigo-50 shadow-sm"
                    : "hover:bg-stone-50"
                }`}
              >
                {/* Custom checkbox */}
                <span
                  className={`flex-shrink-0 w-4 h-4 rounded border flex items-center justify-center transition-all ${
                    isSelected
                      ? "bg-indigo-500 border-indigo-500"
                      : "border-stone-300 bg-white group-hover:border-indigo-300"
                  }`}
                >
                  {isSelected && (
                    <svg viewBox="0 0 10 10" className="w-2.5 h-2.5" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M1.5 5l2.5 2.5 4.5-4.5" />
                    </svg>
                  )}
                </span>

                {/* Avatar */}
                <div className="relative flex-shrink-0">
                  <img
                    src={normalizeImg(m.avatar)}
                    alt={m.fullName}
                    className={`w-8 h-8 rounded-full object-cover ring-2 transition-all ${
                      isSelected ? "ring-indigo-300" : "ring-stone-100"
                    }`}
                  />
                  {isSelected && (
                    <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-indigo-500 rounded-full border-2 border-white flex items-center justify-center">
                      <svg viewBox="0 0 8 8" className="w-1.5 h-1.5" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M1 4l2 2 4-4" />
                      </svg>
                    </span>
                  )}
                </div>

                {/* Name */}
                <div className="flex-1 min-w-0">
                  <p className={`text-[13px] font-medium truncate transition-colors ${
                    isSelected ? "text-indigo-700" : "text-stone-700"
                  }`}>
                    {m.fullName}
                  </p>
                </div>
              </button>
            );
          })}

          {filteredMembers.length === 0 && (
            <div className="flex flex-col items-center justify-center py-8 gap-2">
              <div className="w-10 h-10 rounded-full bg-stone-100 flex items-center justify-center">
                <svg viewBox="0 0 24 24" className="w-5 h-5 text-stone-400" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <circle cx="12" cy="8" r="4" />
                  <path d="M4 20c0-4 3.58-7 8-7s8 3 8 7" strokeLinecap="round" />
                </svg>
              </div>
              <p className="text-[13px] text-stone-400">
                {search ? `No results for "${search}"` : "No members available"}
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-2 border-t border-stone-100">
          <span className="text-[12px] text-stone-400">
            {selectedIds.size > 0
              ? `${selectedIds.size} member${selectedIds.size > 1 ? "s" : ""} selected`
              : "No selection"}
          </span>
          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="px-3 py-1.5 text-[13px] font-medium text-stone-500 hover:text-stone-700 hover:bg-stone-100 rounded-lg transition-all"
            >
              Cancel
            </button>
            <button
              disabled={selectedIds.size === 0}
              onClick={() => onSelect([...selectedIds])}
              className="flex items-center gap-1.5 px-4 py-1.5 text-[13px] font-medium bg-indigo-500 hover:bg-indigo-600 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-lg transition-all shadow-sm shadow-indigo-200"
            >
              <svg viewBox="0 0 16 16" className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M2 8h12M9 3l5 5-5 5" />
              </svg>
              Assign
              {selectedIds.size > 0 && (
                <span className="bg-indigo-400 text-white text-[11px] font-semibold px-1.5 py-0.5 rounded-full leading-none">
                  {selectedIds.size}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default BulkAssignModal;