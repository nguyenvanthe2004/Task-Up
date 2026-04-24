import { useState } from "react";
import { priorityBadge, statusBadge } from "../../constants";
import { Task } from "../../types/task";

const TaskCard: React.FC<{
  task: Task;
  isDone: boolean;
  onSelect: (task: Task) => void;
  onDelete: (id: string) => void;
}> = ({ task, isDone, onSelect, onDelete }) => {

  return (
    <div
      className={`group relative bg-white rounded-xl border border-stone-100 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-150 p-3.5 ${
        isDone ? "opacity-55" : ""
      }`}
    >
      {/* Tag + kebab row */}
      <div className="flex items-center justify-between mb-2.5">
        <span
          className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ${
            priorityBadge[task.priority!] ?? "bg-stone-50 text-stone-500"
          }`}
        >
          <span className="h-1.5 w-1.5 rounded-full bg-current opacity-70" />
          {task.priority}
        </span>

        <div className="relative">
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
            <div className="absolute right-0 top-6 z-20 bg-white shadow-xl border border-stone-100 rounded-xl py-1 w-32 text-xs">
              <button
                className="w-full text-left px-3 py-2 hover:bg-stone-50 text-stone-700 font-medium"
                onClick={(e) => {
                  e.stopPropagation();
                  onSelect(task);
                  setMenuOpen(false);
                }}
              >
                View detail
              </button>
              <button
                className="w-full text-left px-3 py-2 hover:bg-rose-50 text-rose-600 font-medium"
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(task._id);
                  setMenuOpen(false);
                }}
              >
                Delete
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Title */}
      <p
        onClick={() => onSelect(task)}
        className={`text-sm font-semibold leading-snug mb-3 cursor-pointer hover:text-indigo-600 transition-colors ${
          isDone ? "line-through text-stone-400" : "text-stone-700"
        }`}
      >
        {task.name}
      </p>

      {/* Footer */}
      <div className="flex items-center justify-between">
        <span
          className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[10px] font-semibold ${
            statusBadge[task.status] ?? "bg-stone-50 text-stone-500"
          }`}
        >
          <span className="h-1.5 w-1.5 rounded-full bg-current" />
          {task.status}
        </span>

        <div className="flex items-center gap-2">
          <span className="text-[11px] text-stone-400 font-medium">
            {task.dueDate}
          </span>
          <img
            src={task.avatar}
            alt={task.assignee}
            className="w-5 h-5 rounded-full border border-white shadow-sm object-cover"
          />
        </div>
      </div>
    </div>
  );
};

export default TaskCard;
