import React, { useState } from "react";
import { KanbanColumn, Task } from "../../types/task";
import DetailTask from "./DetailTask";
import TaskCard from "./TaskCard";

const INITIAL_COLUMNS: KanbanColumn[] = [
  {
    id: "todo",
    title: "To Do",
    color: "bg-stone-400",
    tasks: [
      {
        _id: "1",
        name: "Design Refresh for Mobile App",
        assignee: "Anna",
        avatar: "https://i.pravatar.cc/100?img=1",
        dueDate: "2023-10-24",
        priority: "High",
        status: "Active",
      },
      {
        _id: "2",
        name: "Brand Identity Styleguide Update",
        assignee: "John",
        avatar: "https://i.pravatar.cc/100?img=2",
        dueDate: "Tomorrow",
        priority: "Medium",
        status: "Review",
      },
    ],
  },
  {
    id: "inprogress",
    title: "In Progress",
    color: "bg-indigo-500",
    tasks: [
      {
        _id: "3",
        name: "SEO Strategy Document",
        assignee: "Lisa",
        avatar: "https://i.pravatar.cc/100?img=3",
        dueDate: "2023-11-02",
        priority: "Medium",
        status: "Waiting",
      },
    ],
  },
  {
    id: "review",
    title: "Review",
    color: "bg-violet-500",
    tasks: [],
  },
  {
    id: "done",
    title: "Done",
    color: "bg-emerald-500",
    tasks: [],
  },
];

const KanbanBoard: React.FC = () => {
  const [columns, setColumns] = useState<KanbanColumn[]>(INITIAL_COLUMNS);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [dragging, setDragging] = useState<{ taskId: string; fromCol: string } | null>(null);
  const [dragOver, setDragOver] = useState<string | null>(null);

  const deleteTask = (taskId: string) =>
    setColumns((cols) =>
      cols.map((c) => ({ ...c, tasks: c.tasks.filter((t) => t._id !== taskId) }))
    );

  const handleDrop = (toColId: string) => {
    if (!dragging || dragging.fromCol === toColId) {
      setDragging(null);
      setDragOver(null);
      return;
    }
    setColumns((cols) => {
      let moved: Task | undefined;
      const next = cols.map((c) => {
        if (c.id === dragging.fromCol) {
          moved = c.tasks.find((t) => t._id === dragging.taskId);
          return { ...c, tasks: c.tasks.filter((t) => t._id !== dragging.taskId) };
        }
        return c;
      });
      return next.map((c) =>
        c.id === toColId && moved ? { ...c, tasks: [moved, ...c.tasks] } : c
      );
    });
    setDragging(null);
    setDragOver(null);
  };

  return (
    <div className="w-full mt-6">

      {/* ── Scrollable board ── */}
      <div
        className="flex items-start gap-3"
        style={{ overflowX: "auto", scrollbarWidth: "thin", scrollbarColor: "#e7e5e4 transparent" }}
      >
        {columns.map((col) => (
          <section
            key={col.id}
            className={`
              flex-none flex flex-col
              w-[240px] sm:w-[260px] lg:w-64
              rounded-2xl border transition-all duration-150
              ${dragOver === col.id
                ? "border-indigo-300 bg-indigo-50/50 shadow-lg"
                : "border-stone-200/60 bg-white/60"
              }
            `}
            onDragOver={(e) => { e.preventDefault(); setDragOver(col.id); }}
            onDragLeave={() => setDragOver(null)}
            onDrop={() => handleDrop(col.id)}
          >
            {/* Column header */}
            <div className="flex items-center justify-between px-3 pt-3 pb-2.5">
              <div className="flex items-center gap-2 min-w-0">
                <span className={`w-2.5 h-2.5 rounded-full flex-none ${col.color}`} />
                <span className="text-xs font-bold text-stone-600 uppercase tracking-widest truncate">
                  {col.title}
                </span>
                <span className="text-[10px] font-bold text-stone-400 bg-stone-100 rounded-full px-1.5 py-0.5 flex-none">
                  {col.tasks.length}
                </span>
              </div>
              <button className="p-1 rounded-lg text-stone-300 hover:text-indigo-500 hover:bg-indigo-50 transition-colors flex-none ml-1">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                </svg>
              </button>
            </div>

            {/* Cards */}
            <div
              className="flex-1 px-2.5 pb-0 space-y-2 overflow-y-auto"
              style={{
                // navbar 64px + MyTask header ~130px + col header ~48px + footer ~44px + gap
                maxHeight: "calc(100vh - 64px - 130px - 48px - 44px - 24px)",
                scrollbarWidth: "thin",
                scrollbarColor: "#e7e5e4 transparent",
              }}
            >
              {col.tasks.map((task) => (
                <div
                  key={task._id}
                  draggable
                  onDragStart={() => setDragging({ taskId: task._id, fromCol: col.id })}
                  onDragEnd={() => { setDragging(null); setDragOver(null); }}
                  className={dragging?.taskId === task._id ? "opacity-40" : ""}
                >
                  <TaskCard
                    task={task}
                    isDone={col.id === "done"}
                    onSelect={setSelectedTask}
                    onDelete={deleteTask}
                  />
                </div>
              ))}

              {col.tasks.length === 0 && (
                <div className="flex flex-col items-center justify-center py-8 text-stone-300">
                  <svg className="w-6 h-6 mb-1.5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  <p className="text-xs font-medium">No tasks</p>
                </div>
              )}
            </div>

            {/* Add task footer */}
            <div className="px-2.5 py-2.5">
              <button className="w-full flex items-center justify-center gap-1.5 py-2 border border-dashed border-stone-200 rounded-xl text-stone-400 hover:text-indigo-500 hover:border-indigo-300 hover:bg-indigo-50/50 transition-all text-xs font-semibold">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                </svg>
                Add task
              </button>
            </div>
          </section>
        ))}

        {/* Add column */}
        <button className="flex-none self-start flex items-center gap-2 px-4 py-2.5 border-2 border-dashed border-stone-200 rounded-2xl text-stone-400 hover:bg-white hover:text-indigo-500 hover:border-indigo-200 transition-all text-xs font-bold tracking-wide whitespace-nowrap">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          Add Column
        </button>
      </div>

      {/* ── FAB ── */}
      <div className="fixed bottom-10 right-10 z-30">
        <button className="group flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-indigo-700 text-white shadow-2xl shadow-indigo-400/40 transition-all hover:scale-110 active:scale-95">
          <span className="material-symbols-outlined text-[32px] transition-transform group-hover:rotate-90">
            add
          </span>
        </button>
      </div>

      {/* ── Detail Drawer ── */}
      {selectedTask && (
        <DetailTask task={selectedTask} onClose={() => setSelectedTask(null)} />
      )}
    </div>
  );
};

export default KanbanBoard;