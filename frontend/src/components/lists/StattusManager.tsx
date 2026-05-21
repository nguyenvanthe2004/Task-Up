import React, { useEffect, useRef, useState } from "react";
import {
  callGetStatuses,
  callCreateStatus,
  callUpdateStatus,
  callDeleteStatus,
} from "../../services/status";
import { Status } from "../../types/status";

const POSITION_COLORS: Record<number, { color: string; label: string }> = {
  1: { color: "#64748b", label: "Gray" },
  2: { color: "#3b82f6", label: "Blue" },
  3: { color: "#eab308", label: "Yellow" },
};

const DONE_COLOR = "#22c55e";

interface StatusManagerProps {
  spaceId: number;
  onStatusChange?: () => void;
}

const StatusManager: React.FC<StatusManagerProps> = ({
  spaceId,
  onStatusChange,
}) => {
  const [open, setOpen] = useState(false);
  const [statuses, setStatuses] = useState<Status[]>([]);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editName, setEditName] = useState("");
  const [addingPos, setAddingPos] = useState<number | null>(null);
  const [newName, setNewName] = useState("");
  const panelRef = useRef<HTMLDivElement>(null);
  const editInputRef = useRef<HTMLInputElement>(null);
  const newInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setOpen(false);
        setEditingId(null);
        setAddingPos(null);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const isDoneStatus = (s: Status) =>
    s.isDone === true || s.name?.trim().toLowerCase() === "done";

  const fetchStatuses = async () => {
    setLoading(true);
    try {
      const res = await callGetStatuses();
      setStatuses(res.data ?? []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleOpen = () => {
    if (!open) fetchStatuses();
    setOpen((prev) => !prev);
    setEditingId(null);
    setAddingPos(null);
  };

  const startEdit = (status: Status) => {
    setEditingId(status.id);
    setEditName(status.name);
    setAddingPos(null);
    setTimeout(() => editInputRef.current?.focus(), 50);
  };

  const cancelEdit = () => setEditingId(null);

  const saveEdit = async (id: number) => {
    if (!editName.trim()) return;
    try {
      const s = statuses.find((x) => x.id === id);
      await callUpdateStatus(id, {
        name: editName.trim(),
        color: POSITION_COLORS[s?.position ?? 1]?.color ?? DONE_COLOR,
      });
      setEditingId(null);
      await fetchStatuses();
      onStatusChange?.();
    } catch (e) {
      console.error(e);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await callDeleteStatus(id);
      await fetchStatuses();
      onStatusChange?.();
    } catch (e) {
      console.error(e);
    }
  };

  const startAdd = (pos: number) => {
    setAddingPos(pos);
    setNewName("");
    setEditingId(null);
    setTimeout(() => newInputRef.current?.focus(), 50);
  };

  const cancelAdd = () => {
    setAddingPos(null);
    setNewName("");
  };

  const saveNew = async () => {
    if (!newName.trim() || addingPos === null) return;
    try {
      await callCreateStatus({
        name: newName.trim(),
        color: POSITION_COLORS[addingPos].color,
        position: addingPos,
        spaceId,
      });
      setAddingPos(null);
      setNewName("");
      await fetchStatuses();
      onStatusChange?.();
    } catch (e) {
      console.error(e);
    }
  };

  const doneStatus = statuses.find(isDoneStatus);
  const editableStatuses = statuses
    .filter((s) => !isDoneStatus(s))
    .sort((a, b) => (a.position ?? 0) - (b.position ?? 0));

  const slots = [1, 2, 3].map((pos) => ({
    pos,
    meta: POSITION_COLORS[pos],
    status: editableStatuses.find((s) => s.position === pos) ?? null,
  }));

  return (
    <div ref={panelRef} className="relative">
      <button
        onClick={handleOpen}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
          open
            ? "border-indigo-300 bg-indigo-50 text-indigo-600"
            : "border-stone-200 text-stone-600 hover:bg-stone-50 hover:border-stone-300"
        }`}
      >
        <svg
          viewBox="0 0 16 16"
          className="w-3.5 h-3.5"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="8" cy="8" r="3" />
          <path d="M8 1v2M8 13v2M1 8h2M13 8h2M3.22 3.22l1.42 1.42M11.36 11.36l1.42 1.42M3.22 12.78l1.42-1.42M11.36 4.64l1.42-1.42" />
        </svg>
        Status
        <svg
          viewBox="0 0 16 16"
          className={`w-3 h-3 transition-transform ${open ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M4 6l4 4 4-4" />
        </svg>
      </button>

      {open && (
        <div className="absolute right-0 mt-1.5 w-72 bg-white border border-stone-200 rounded-xl shadow-lg shadow-stone-100 overflow-hidden z-20">
          <div className="px-4 py-3 border-b border-stone-100">
            <p className="text-[11px] font-semibold text-stone-400 uppercase tracking-wider">
              Manage statuses
            </p>
            <p className="text-[10px] text-stone-400 mt-0.5">
              3 custom slots · color fixed per position · Done is always last
            </p>
          </div>

          <div className="py-1 max-h-80 overflow-y-auto">
            {loading ? (
              <div className="px-4 py-6 text-center text-xs text-stone-400">
                Loading…
              </div>
            ) : (
              <>
                {/* Done — locked at position 4 */}
                {doneStatus && (
                  <div className="px-3 py-2.5 flex items-center gap-2.5 opacity-60">
                    <span
                      className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                      style={{ background: DONE_COLOR }}
                    />
                    <span className="flex-1 text-[13px] font-medium text-stone-600">
                      {doneStatus.name}
                    </span>
                    <span className="text-[10px] font-medium text-stone-400 bg-stone-100 px-1.5 py-0.5 rounded-md">
                      locked
                    </span>
                    <svg
                      viewBox="0 0 16 16"
                      className="w-3.5 h-3.5 text-stone-300"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                    >
                      <rect x="3" y="7" width="10" height="7" rx="1.5" />
                      <path d="M5 7V5a3 3 0 016 0v2" />
                    </svg>
                  </div>
                )}

                <div className="mx-3 my-1 border-t border-stone-100" />

                {/* 3 slots cố định */}
                {slots.map(({ pos, meta, status }) => {
                  const isEditing = editingId === status?.id;
                  const isAdding = addingPos === pos;

                  if (isEditing && status) {
                    return (
                      <div key={pos} className="px-3 py-2">
                        <div className="flex items-center gap-2 mb-1.5">
                          <span
                            className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                            style={{ background: meta.color }}
                          />
                          <input
                            ref={editInputRef}
                            value={editName}
                            onChange={(e) => setEditName(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") saveEdit(status.id);
                              if (e.key === "Escape") cancelEdit();
                            }}
                            className="flex-1 text-[13px] px-2 py-1 border border-indigo-300 rounded-lg outline-none focus:ring-2 focus:ring-indigo-100 text-stone-700"
                          />
                          <button
                            onClick={() => saveEdit(status.id)}
                            className="text-[11px] font-semibold text-indigo-600 hover:text-indigo-800"
                          >
                            Save
                          </button>
                          <button
                            onClick={cancelEdit}
                            className="text-[11px] font-semibold text-stone-400 hover:text-stone-600"
                          >
                            Cancel
                          </button>
                        </div>
                        <p className="text-[10px] text-stone-400 pl-5">
                          Position {pos}
                        </p>
                      </div>
                    );
                  }

                  if (isAdding) {
                    return (
                      <div key={pos} className="px-3 py-2">
                        <div className="flex items-center gap-2 mb-1.5">
                          <span
                            className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                            style={{ background: meta.color }}
                          />
                          <input
                            ref={newInputRef}
                            value={newName}
                            onChange={(e) => setNewName(e.target.value)}
                            placeholder="Status name…"
                            onKeyDown={(e) => {
                              if (e.key === "Enter") saveNew();
                              if (e.key === "Escape") cancelAdd();
                            }}
                            className="flex-1 text-[13px] px-2 py-1 border border-indigo-300 rounded-lg outline-none focus:ring-2 focus:ring-indigo-100 text-stone-700 placeholder-stone-300"
                          />
                          <button
                            onClick={saveNew}
                            className="text-[11px] font-semibold text-indigo-600 hover:text-indigo-800"
                          >
                            Add
                          </button>
                          <button
                            onClick={cancelAdd}
                            className="text-[11px] font-semibold text-stone-400 hover:text-stone-600"
                          >
                            Cancel
                          </button>
                        </div>
                        <p className="text-[10px] text-stone-400 pl-5">
                          Position {pos}
                        </p>
                      </div>
                    );
                  }

                  if (status) {
                    return (
                      <div
                        key={pos}
                        className="px-3 py-2.5 flex items-center gap-2.5 group hover:bg-stone-50 transition-colors"
                      >
                        <span
                          className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                          style={{ background: meta.color }}
                        />
                        <span className="flex-1 text-[13px] font-medium text-stone-700">
                          {status.name}
                        </span>

                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => startEdit(status)}
                            className="p-1 rounded-md hover:bg-stone-200 text-stone-400 hover:text-stone-600 transition-colors"
                            title="Edit"
                          >
                            <svg
                              viewBox="0 0 16 16"
                              className="w-3.5 h-3.5"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="1.8"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <path d="M11 2l3 3-8 8H3v-3l8-8z" />
                            </svg>
                          </button>
                          <button
                            onClick={() => handleDelete(status.id)}
                            className="p-1 rounded-md hover:bg-red-50 text-stone-400 hover:text-red-500 transition-colors"
                            title="Delete"
                          >
                            <svg
                              viewBox="0 0 16 16"
                              className="w-3.5 h-3.5"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="1.8"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <path d="M3 4h10M6 4V2h4v2M5 4v8a1 1 0 001 1h4a1 1 0 001-1V4" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    );
                  }

                  return (
                    <button
                      key={pos}
                      onClick={() => startAdd(pos)}
                      disabled={addingPos !== null}
                      className="w-full px-3 py-2.5 flex items-center gap-2.5 hover:bg-stone-50 transition-colors disabled:opacity-40 disabled:cursor-default text-left"
                    >
                      <span
                        className="w-2.5 h-2.5 rounded-full flex-shrink-0 opacity-30"
                        style={{ background: meta.color }}
                      />
                      <span className="flex-1 text-[13px] text-stone-400 italic">
                        Empty slot — click to add
                      </span>
                      <span className="text-[10px] text-stone-300">
                        pos {pos} · {meta.label}
                      </span>
                    </button>
                  );
                })}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default StatusManager;
