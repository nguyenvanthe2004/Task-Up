import React, { useState } from "react";
import dayjs, { Dayjs } from "dayjs";
import { CalendarTask, Task } from "../../types/task";
import DetailTask from "./DetailTask";
import { priorityBadge, WEEKDAYS } from "../../constants";
import { buildCells } from "../../lib/until";
import MiniMonth from "../ui/MiniMonth";

const CATEGORY_STYLES: Record<string, string> = {
  Design: "bg-indigo-50 text-indigo-600",
  Engineering: "bg-blue-50 text-blue-600",
  Finance: "bg-amber-50 text-amber-600",
  Admin: "bg-stone-100 text-stone-600",
  UX: "bg-violet-50 text-violet-600",
  Marketing: "bg-rose-50 text-rose-600",
};

const EVENT_PILL: Record<string, string> = {
  Design: "bg-indigo-100 text-indigo-700 border-l-2 border-indigo-400",
  Engineering: "bg-blue-100 text-blue-700 border-l-2 border-blue-400",
  Finance: "bg-amber-100 text-amber-700 border-l-2 border-amber-400",
  Admin: "bg-stone-100 text-stone-600",
  UX: "bg-violet-100 text-violet-700 border-l-2 border-violet-400",
  Marketing: "bg-rose-100 text-rose-700 border-l-2 border-rose-400",
  Deadline: "bg-red-100 text-red-700 border-l-2 border-red-500",
};

const INITIAL_TASKS: CalendarTask[] = [
  {
    _id: "c1",
    name: "Design Sync",
    assignee: "Anna",
    avatar: "https://i.pravatar.cc/100?img=1",
    dueDate: "",
    priority: "Medium",
    status: "Active",
    day: 2,
    category: "Design",
    duration: "30 min",
  },
  {
    _id: "c2",
    name: "Code Review",
    assignee: "Bob",
    avatar: "https://i.pravatar.cc/100?img=2",
    dueDate: "",
    priority: "Low",
    status: "Review",
    day: 3,
    category: "Engineering",
    duration: "1 hr",
  },
  {
    _id: "c3",
    name: "Client Workshop",
    assignee: "Lisa",
    avatar: "https://i.pravatar.cc/100?img=3",
    dueDate: "",
    priority: "High",
    status: "Active",
    day: 5,
    category: "UX",
    duration: "2 hrs",
  },
  {
    _id: "c4",
    name: "Project Deadline",
    assignee: "Anna",
    avatar: "https://i.pravatar.cc/100?img=1",
    dueDate: "",
    priority: "High",
    status: "Active",
    day: 6,
    category: "Deadline",
    duration: "",
  },
  {
    _id: "c5",
    name: "Sprint Retro",
    assignee: "Bob",
    avatar: "https://i.pravatar.cc/100?img=2",
    dueDate: "",
    priority: "Medium",
    status: "Review",
    day: 6,
    category: "Admin",
    duration: "1 hr",
  },
  {
    _id: "c6",
    name: "Architectural Review",
    assignee: "Lisa",
    avatar: "https://i.pravatar.cc/100?img=3",
    dueDate: "",
    priority: "High",
    status: "Active",
    day: 10,
    category: "Engineering",
    duration: "1.5 hrs",
  },
  {
    _id: "c7",
    name: "Site Visit",
    assignee: "Anna",
    avatar: "https://i.pravatar.cc/100?img=1",
    dueDate: "",
    priority: "Medium",
    status: "Waiting",
    day: 12,
    category: "Design",
    duration: "3 hrs",
  },
  {
    _id: "c8",
    name: "Team Lunch",
    assignee: "Bob",
    avatar: "https://i.pravatar.cc/100?img=2",
    dueDate: "",
    priority: "Low",
    status: "Active",
    day: 16,
    category: "Admin",
    duration: "1 hr",
  },
  {
    _id: "c9",
    name: "Launch Event",
    assignee: "Lisa",
    avatar: "https://i.pravatar.cc/100?img=3",
    dueDate: "",
    priority: "High",
    status: "Active",
    day: 18,
    category: "Marketing",
    duration: "4 hrs",
  },
  {
    _id: "u1",
    name: "Update typography guidelines",
    assignee: "Anna",
    avatar: "https://i.pravatar.cc/100?img=1",
    dueDate: "-",
    priority: "Medium",
    status: "Active",
    day: 0,
    category: "Design",
    duration: "15 min",
  },
  {
    _id: "u2",
    name: "Quarterly budget report",
    assignee: "Bob",
    avatar: "https://i.pravatar.cc/100?img=2",
    dueDate: "-",
    priority: "High",
    status: "Waiting",
    day: 0,
    category: "Finance",
    duration: "2 hrs",
  },
  {
    _id: "u3",
    name: "Archive Q2 documentation",
    assignee: "Lisa",
    avatar: "https://i.pravatar.cc/100?img=3",
    dueDate: "-",
    priority: "Low",
    status: "Review",
    day: 0,
    category: "Admin",
    duration: "45 min",
  },
  {
    _id: "u4",
    name: "API endpoint optimization",
    assignee: "Anna",
    avatar: "https://i.pravatar.cc/100?img=1",
    dueDate: "-",
    priority: "High",
    status: "Active",
    day: 0,
    category: "Engineering",
    duration: "3 hrs",
  },
];

const CalendarView: React.FC = () => {
  const today = dayjs();
  const [current, setCurrent] = useState(today.date(1));
  const [tasks, setTasks] = useState<CalendarTask[]>(INITIAL_TASKS);
  const [selected, setSelected] = useState<Task | null>(null);
  const [calView, setCalView] = useState<"month" | "week">("month");
  const [dragId, setDragId] = useState<string | null>(null);
  const [filters, setFilters] = useState(Object.keys(CATEGORY_STYLES));

  const cells = buildCells(current);
  const unscheduled = tasks.filter((t) => t.day === 0);

  const tasksForDay = (day: number) =>
    tasks.filter(
      (t) => t.day === day && t.category && filters.includes(t.category),
    );

  const handleDrop = (day: number) => {
    if (!dragId) return;
    setTasks((ts) => ts.map((t) => (t._id === dragId ? { ...t, day } : t)));
    setDragId(null);
  };

  const toggleFilter = (cat: string) =>
    setFilters((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat],
    );

  return (
    <div
      className="w-full mt-4 flex gap-0 overflow-hidden rounded-xl border border-stone-200/60 bg-white/60"
      style={{ minHeight: "calc(100vh - 200px)" }}
    >
      {/* ── Calendar ── */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-stone-100 bg-white/80">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setCurrent((c) => c.subtract(1, "month"))}
              className="p-1.5 rounded-lg text-stone-400 hover:bg-stone-100 transition-colors"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                strokeWidth={2.5}
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>
            <span className="text-sm font-bold text-stone-800">
              {current.format("MMMM YYYY")}
            </span>
            <button
              onClick={() => setCurrent((c) => c.add(1, "month"))}
              className="p-1.5 rounded-lg text-stone-400 hover:bg-stone-100 transition-colors"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                strokeWidth={2.5}
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
            <button
              onClick={() => setCurrent(today.date(1))}
              className="px-2.5 py-1 text-[11px] font-semibold text-stone-500 bg-stone-100 hover:bg-stone-200 rounded-lg transition-colors"
            >
              Today
            </button>
          </div>
          <div className="flex bg-stone-100 rounded-lg p-0.5">
            {(["month", "week"] as const).map((v) => (
              <button
                key={v}
                onClick={() => setCalView(v)}
                className={`px-3 py-1 text-xs font-semibold rounded-md capitalize transition-all ${calView === v ? "bg-white text-indigo-600 shadow-sm" : "text-stone-500 hover:text-stone-700"}`}
              >
                {v}
              </button>
            ))}
          </div>
        </div>

        {/* Weekday labels */}
        <div className="grid grid-cols-7 border-b border-stone-100 bg-stone-50/50">
          {WEEKDAYS.map((d) => (
            <div
              key={d}
              className="py-2 text-center text-[10px] font-bold tracking-widest text-stone-400 uppercase"
            >
              {d}
            </div>
          ))}
        </div>

        {/* Grid */}
        <div
          className="flex-1 grid grid-cols-7 overflow-y-auto"
          style={{
            scrollbarWidth: "thin",
            scrollbarColor: "#e7e5e4 transparent",
          }}
        >
          {cells.map((cell, i) => {
            const dayTasks = cell.cur ? tasksForDay(cell.day) : [];
            const isToday =
              cell.cur &&
              current.isSame(today, "month") &&
              cell.day === today.date();

            return (
              <div
                key={i}
                className={`border-r border-b border-stone-100 p-2 min-h-[120px] transition-colors group relative ${!cell.cur ? "bg-stone-50/40" : "hover:bg-indigo-50/20 cursor-pointer"} ${i % 7 === 6 ? "border-r-0" : ""}`}
                onDragOver={(e) => e.preventDefault()}
                onDrop={() => cell.cur && handleDrop(cell.day)}
              >
                <span
                  className={`inline-flex w-6 h-6 items-center justify-center rounded-full text-xs font-bold transition-colors ${!cell.cur ? "text-stone-300" : isToday ? "bg-indigo-600 text-white" : "text-stone-600 group-hover:text-indigo-600"}`}
                >
                  {cell.day}
                </span>
                <div className="mt-1.5 space-y-1">
                  {dayTasks.slice(0, 3).map((t) => (
                    <div
                      key={t._id}
                      draggable
                      onDragStart={() => setDragId(t._id)}
                      onClick={() => setSelected(t)}
                      className={`px-2 py-0.5 text-[10px] font-semibold rounded truncate cursor-pointer hover:opacity-80 transition-opacity ${EVENT_PILL[t.category ?? ""] ?? "bg-stone-100 text-stone-600"}`}
                    >
                      {t.name}
                    </div>
                  ))}
                  {dayTasks.length > 3 && (
                    <div className="text-[10px] font-bold text-stone-400 px-1">
                      +{dayTasks.length - 3} more
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Sidebar ── */}
      <aside
        className="w-64 flex-none border-l border-stone-100 bg-stone-50/40 flex flex-col overflow-y-auto"
        style={{
          scrollbarWidth: "thin",
          scrollbarColor: "#e7e5e4 transparent",
        }}
      >
        {/* Filters */}
        <div className="p-4 border-b border-stone-100">
          <h3 className="text-[10px] font-bold tracking-[0.15em] text-stone-400 uppercase mb-3">
            Filters
          </h3>
          <div className="space-y-2">
            {Object.keys(CATEGORY_STYLES).map((cat) => (
              <label
                key={cat}
                className="flex items-center gap-2.5 cursor-pointer group"
              >
                <input
                  type="checkbox"
                  checked={filters.includes(cat)}
                  onChange={() => toggleFilter(cat)}
                  className="w-3.5 h-3.5 rounded border-stone-300 text-indigo-600 focus:ring-indigo-400"
                />
                <span className="text-xs font-medium text-stone-600 group-hover:text-stone-800 transition-colors flex-1">
                  {cat}
                </span>
                <span
                  className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${CATEGORY_STYLES[cat]}`}
                >
                  {tasks.filter((t) => t.day > 0 && t.category === cat).length}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Unscheduled */}
        <div className="p-4 flex-1">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-[10px] font-bold tracking-[0.15em] text-stone-400 uppercase">
              Unscheduled
            </h3>
            <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-stone-200 text-stone-600">
              {unscheduled.length}
            </span>
          </div>
          <div className="space-y-2">
            {unscheduled.map((t) => (
              <div
                key={t._id}
                draggable
                onDragStart={() => setDragId(t._id)}
                onClick={() => setSelected(t)}
                className="p-3 bg-white rounded-xl border border-stone-100 shadow-sm hover:border-indigo-200 hover:shadow-md transition-all cursor-grab active:cursor-grabbing group"
              >
                <div className="flex items-start justify-between gap-2">
                  <span className="text-xs font-semibold text-stone-700 leading-snug group-hover:text-indigo-600 transition-colors">
                    {t.name}
                  </span>
                  <svg
                    className="w-3.5 h-3.5 text-stone-300 flex-none mt-0.5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <circle cx="7" cy="4" r="1.5" />
                    <circle cx="13" cy="4" r="1.5" />
                    <circle cx="7" cy="10" r="1.5" />
                    <circle cx="13" cy="10" r="1.5" />
                    <circle cx="7" cy="16" r="1.5" />
                    <circle cx="13" cy="16" r="1.5" />
                  </svg>
                </div>
                <div className="mt-2 flex items-center gap-2">
                  <span
                    className={`text-[9px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wide ${CATEGORY_STYLES[t.category ?? ""] ?? "bg-stone-100 text-stone-500"}`}
                  >
                    {t.category}
                  </span>
                  {t.duration && (
                    <span className="text-[10px] text-stone-400 font-medium">
                      {t.duration}
                    </span>
                  )}
                </div>
                <div className="mt-2">
                  <span
                    className={`inline-flex items-center gap-1 text-[10px] font-semibold rounded px-1.5 py-0.5 ${priorityBadge[t.priority] ?? "bg-stone-50 text-stone-500"}`}
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-current opacity-70" />
                    {t.priority}
                  </span>
                </div>
              </div>
            ))}
            {unscheduled.length === 0 && (
              <div className="flex flex-col items-center py-6 text-stone-300">
                <svg
                  className="w-6 h-6 mb-1"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={1.5}
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                <p className="text-xs font-medium">All scheduled!</p>
              </div>
            )}
          </div>
        </div>

        {/* Mini month preview */}
        <div className="p-4 border-t border-stone-100">
          <MiniMonth d={current.add(1, "month")} />
        </div>

        {/* Workspace footer */}
        <div className="p-4 border-t border-stone-100">
          <div className="flex items-center gap-2.5 p-2.5 bg-white rounded-xl border border-stone-100 shadow-sm">
            <div className="flex -space-x-2">
              {["1", "2", "3"].map((i) => (
                <img
                  key={i}
                  src={`https://i.pravatar.cc/100?img=${i}`}
                  alt=""
                  className="w-6 h-6 rounded-full border-2 border-white object-cover"
                />
              ))}
              <div className="w-6 h-6 rounded-full border-2 border-white bg-stone-200 flex items-center justify-center text-[8px] font-bold text-stone-500">
                +2
              </div>
            </div>
            <span className="text-[10px] font-semibold text-stone-500">
              Workspace Active
            </span>
          </div>
        </div>
      </aside>

      {selected && (
        <DetailTask task={selected} onClose={() => setSelected(null)} />
      )}
    </div>
  );
};

export default CalendarView;
