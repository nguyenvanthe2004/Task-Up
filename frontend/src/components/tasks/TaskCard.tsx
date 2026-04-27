import React, { useState } from "react";
import { priorityBadge, priorityColor } from "../../constants";
import { Member, Task } from "../../types/task";
import { Status } from "../../types/status";
import { AvatarStack } from "../ui/AvatarStack";
import { fmtDate } from "../../lib/until";

const TaskCard: React.FC<{
  task: Task;
  isDone: boolean;
  isChecked: boolean;
  statuses: Status[];
  members: Member[];
  onSelect: (task: Task) => void;
  onDelete: (id: number) => void;
  onEdit: (id: number) => void;
  onCheck: (id: number) => void;
}> = ({
  task,
  isDone,
  isChecked,
  statuses,
  members,
  onSelect,
  onDelete,
  onEdit,
  onCheck,
}) => {
  const [menuOpen, setMenuOpen] = useState(false);

  const status = statuses.find((s) => s.id === task.statusId);
  const overdue = task.dueDate && new Date(task.dueDate) < new Date();

  return (
    <div
      className={`
        group relative bg-white rounded-xl border shadow-sm cursor-pointer
        hover:shadow-md hover:-translate-y-0.5 transition-all duration-150 p-3.5
        ${isChecked ? "border-indigo-300 bg-indigo-50/30 ring-1 ring-indigo-200" : "border-stone-100"}
        ${isDone ? "opacity-55" : ""}
      `}
    >
      <div className="flex items-center justify-between mb-2.5 gap-2">
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={isChecked}
            onChange={(e) => {
              e.stopPropagation();
              onCheck(task.id);
            }}
            onClick={(e) => e.stopPropagation()}
            className="accent-indigo-500 w-3.5 h-3.5 rounded flex-none opacity-0 group-hover:opacity-100 transition-opacity"
            style={isChecked ? { opacity: 1 } : {}}
          />

          {task.priority && (
            <span
              className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ${
                priorityBadge[task.priority] ?? "bg-stone-50 text-stone-500"
              }`}
            >
              <span
                className="h-1.5 w-1.5 rounded-full flex-shrink-0"
                style={{
                  backgroundColor: priorityColor[task.priority] ?? "#78716c",
                }}
              />
              {task.priority}
            </span>
          )}
        </div>

        <div className="relative flex-none">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setMenuOpen((v) => !v);
            }}
            className="p-1 rounded-md text-stone-300 opacity-0 group-hover:opacity-100 hover:bg-stone-50 hover:text-stone-500 transition-all"
          >
            <svg
              className="w-3.5 h-3.5"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <circle cx="10" cy="4" r="1.5" />
              <circle cx="10" cy="10" r="1.5" />
              <circle cx="10" cy="16" r="1.5" />
            </svg>
          </button>
          {menuOpen && (
            <div className="absolute right-0 top-6 z-20 bg-white shadow-xl border border-stone-100 rounded-xl py-1 w-36 text-xs">
              <button
                className="w-full text-left px-3 py-2 hover:bg-stone-50 text-stone-700 font-medium flex items-center gap-2"
                onClick={(e) => {
                  e.stopPropagation();
                  onSelect(task);
                  setMenuOpen(false);
                }}
              >
                <span className="material-symbols-outlined text-[14px]">
                  open_in_new
                </span>
                View detail
              </button>
              <button
                className="w-full text-left px-3 py-2 hover:bg-indigo-50 text-indigo-600 font-medium flex items-center gap-2"
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit(task.id);
                  setMenuOpen(false);
                }}
              >
                <span className="material-symbols-outlined text-[14px]">
                  edit
                </span>
                Edit
              </button>
              <button
                className="w-full text-left px-3 py-2 hover:bg-rose-50 text-rose-600 font-medium flex items-center gap-2"
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(task.id);
                  setMenuOpen(false);
                }}
              >
                <span className="material-symbols-outlined text-[14px]">
                  delete
                </span>
                Delete
              </button>
            </div>
          )}
        </div>
      </div>

      <p
        onClick={() => onSelect(task)}
        className={`text-sm font-semibold leading-snug mb-3 cursor-pointer hover:text-indigo-600 transition-colors ${
          isDone ? "line-through text-stone-400" : "text-stone-700"
        }`}
      >
        {task.name}
      </p>

      {/* Tag */}
      {task.tag && (
        <div className="mb-2">
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-500 text-[10px] font-semibold">
            #{task.tag}
          </span>
        </div>
      )}
      {/* Footer */}
      <div className="flex items-center justify-between gap-2 mt-3 flex-wrap">
        {/* Status badge */}
        {status ? (
          <span
            className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold whitespace-nowrap"
            style={{
              backgroundColor: `${status.color}18`,
              color: status.color,
              border: `1px solid ${status.color}30`,
            }}
          >
            <span
              className="h-1.5 w-1.5 rounded-full flex-shrink-0"
              style={{ backgroundColor: status.color }}
            />
            {status.name}
          </span>
        ) : (
          <span />
        )}

        {/* Assignees */}
        {task.assignees && task.assignees.length > 0 && (
          <AvatarStack members={task.assignees} />
        )}
      </div>

      {/* Date row — chỉ render nếu có ít nhất 1 date */}
      {(task.startDate || task.dueDate) && (
        <div className="flex items-center gap-1.5 mt-2.5 text-[11px] font-medium tabular-nums text-stone-400">
          <svg
            className="w-3 h-3 flex-shrink-0 text-stone-300"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
          >
            <rect x="3" y="4" width="18" height="18" rx="2" />
            <path strokeLinecap="round" d="M16 2v4M8 2v4M3 10h18" />
          </svg>

          {task.startDate && <span>{fmtDate(task.startDate)}</span>}

          {task.startDate && task.dueDate && (
            <span className="text-stone-300">→</span>
          )}

          {task.dueDate && (
            <span className={overdue ? "text-red-400 font-semibold" : ""}>
              {fmtDate(task.dueDate)}
            </span>
          )}
        </div>
      )}

      {/* Drag handle hint (visible on hover) */}
      <div className="absolute top-1/2 -translate-y-1/2 -left-1 opacity-0 group-hover:opacity-100 transition-opacity"></div>
    </div>
  );
};

export default TaskCard;
