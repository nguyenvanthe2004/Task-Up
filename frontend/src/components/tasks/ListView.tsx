import React, { useState } from "react";
import { Task, TaskGroup } from "../../types/task";
import CustomTable from "../ui/CustomTable";
import DetailTask from "./DetailTask";
import { priorityBadge, statusBadge } from "../../constants";

const INITIAL_GROUPS: TaskGroup[] = [
  {
    id: "inprogress",
    title: "In Progress",
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
    id: "todo",
    title: "To Do",
    tasks: [
      {
        _id: "4",
        name: "Design Refresh for Mobile App",
        assignee: "Anna",
        avatar: "https://i.pravatar.cc/100?img=1",
        dueDate: "2023-10-24",
        priority: "High",
        status: "Active",
      },
      {
        _id: "5",
        name: "Brand Identity Styleguide Update",
        assignee: "John",
        avatar: "https://i.pravatar.cc/100?img=2",
        dueDate: "Tomorrow",
        priority: "Medium",
        status: "Review",
      },
      {
        _id: "6",
        name: "SEO Strategy Document",
        assignee: "Lisa",
        avatar: "https://i.pravatar.cc/100?img=3",
        dueDate: "2023-11-02",
        priority: "Medium",
        status: "Waiting",
      },
    ],
  },
];

const ListView: React.FC = () => {
  const [groups, setGroups] = useState<TaskGroup[]>(INITIAL_GROUPS);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [dragging, setDragging] = useState<{ taskId: string; fromGroup: string } | null>(null);
  const [dragOverTask, setDragOverTask] = useState<{ taskId: string; groupId: string } | null>(null);

  const handleDrop = (toGroupId: string, toTaskId: string) => {
    if (!dragging) return;
    const { taskId, fromGroup } = dragging;
    if (fromGroup === toGroupId && taskId === toTaskId) {
      setDragging(null);
      setDragOverTask(null);
      return;
    }
    setGroups((prev) => {
      let moved: Task | undefined;
      const next = prev.map((g) => {
        if (g.id !== fromGroup) return g;
        moved = g.tasks.find((t) => t._id === taskId);
        return { ...g, tasks: g.tasks.filter((t) => t._id !== taskId) };
      });
      if (!moved) return prev;
      return next.map((g) => {
        if (g.id !== toGroupId) return g;
        const toIdx = g.tasks.findIndex((t) => t._id === toTaskId);
        const insertAt = toIdx === -1 ? g.tasks.length : toIdx;
        const updated = [...g.tasks];
        updated.splice(insertAt, 0, moved!);
        return { ...g, tasks: updated };
      });
    });
    setDragging(null);
    setDragOverTask(null);
  };

  const handleDropOnGroup = (toGroupId: string) => {
    if (!dragging || dragging.fromGroup === toGroupId) {
      setDragging(null);
      setDragOverTask(null);
      return;
    }
    setGroups((prev) => {
      let moved: Task | undefined;
      const next = prev.map((g) => {
        if (g.id !== dragging.fromGroup) return g;
        moved = g.tasks.find((t) => t._id === dragging.taskId);
        return { ...g, tasks: g.tasks.filter((t) => t._id !== dragging.taskId) };
      });
      if (!moved) return prev;
      return next.map((g) =>
        g.id === toGroupId ? { ...g, tasks: [...g.tasks, moved!] } : g
      );
    });
    setDragging(null);
    setDragOverTask(null);
  };

  const makeTaskColumns = (groupId: string) => [
    {
      key: "name",
      title: "Task Name",
      width: "1fr",
      render: (row: Task) => (
        <div
          draggable
          onDragStart={() => setDragging({ taskId: row._id, fromGroup: groupId })}
          onDragEnd={() => { setDragging(null); setDragOverTask(null); }}
          onDragOver={(e) => { e.preventDefault(); setDragOverTask({ taskId: row._id, groupId }); }}
          onDrop={(e) => { e.stopPropagation(); handleDrop(groupId, row._id); }}
          onClick={() => setSelectedTask(row)}
          className={`flex items-center gap-3 cursor-pointer group transition-opacity ${
            dragging?.taskId === row._id ? "opacity-40" : ""
          }`}
        >
          <span
            className={`material-symbols-outlined cursor-grab text-[20px] transition-colors ${
              dragOverTask?.taskId === row._id && dragOverTask?.groupId === groupId
                ? "text-indigo-400"
                : "text-stone-300 group-hover:text-indigo-400"
            }`}
          >
            drag_indicator
          </span>
          <span className="text-sm font-medium text-stone-700 group-hover:text-indigo-600 group-hover:underline transition-colors">
            {row.name}
          </span>
        </div>
      ),
    },
    {
      key: "assignee",
      title: "Assignee",
      width: "150px",
      render: (row: Task) => (
        <img
          src={row.avatar}
          alt={row.assignee}
          className="w-7 h-7 rounded-full border-2 border-white shadow-sm object-cover"
        />
      ),
    },
    {
      key: "dueDate",
      title: "Due Date",
      width: "120px",
      render: (row: Task) => (
        <span className="text-[13px] text-stone-500 font-medium">{row.dueDate}</span>
      ),
    },
    {
      key: "priority",
      title: "Priority",
      width: "100px",
      render: (row: Task) => (
        <span
          className={`inline-flex items-center gap-1.5 rounded-md px-2 py-0.5 text-[11px] font-semibold ${
            priorityBadge[row.priority] ?? "bg-stone-50 text-stone-600"
          }`}
        >
          <span className="h-1.5 w-1.5 rounded-full bg-current opacity-70" />
          {row.priority}
        </span>
      ),
    },
    {
      key: "status",
      title: "Status",
      width: "100px",
      render: (row: Task) => (
        <span
          className={`inline-flex items-center gap-1.5 rounded-md px-2 py-0.5 text-[11px] font-semibold ${
            statusBadge[row.status] ?? "bg-stone-50 text-stone-600"
          }`}
        >
          <span className="h-1.5 w-1.5 rounded-full bg-current" />
          {row.status}
        </span>
      ),
    },
  ];

  return (
    <div className="w-full">

      {/* ── Groups ── */}
      <div className="space-y-10">
        {groups.map((group) => (
          <div
            key={group.id}
            onDragOver={(e) => e.preventDefault()}
            onDrop={() => handleDropOnGroup(group.id)}
          >
            <CustomTable
              title={group.title}
              count={group.tasks.length}
              data={group.tasks}
              columns={makeTaskColumns(group.id)}
              showCheckbox
            />
          </div>
        ))}
      </div>

      {/* ── FAB ── */}
      <div className="fixed bottom-10 right-10 z-30">
        <button className="group flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-indigo-700 text-white shadow-2xl shadow-indigo-400/40 transition-all hover:scale-110 active:scale-95">
          <span className="material-symbols-outlined text-[32px] transition-transform group-hover:rotate-90">add</span>
        </button>
      </div>

      {/* ── Bulk action bar ── */}
      <div className="fixed bottom-8 left-1/2 z-40 -translate-x-1/2 flex items-center gap-6 rounded-2xl border border-stone-200/60 bg-white/80 px-6 py-3 shadow-2xl backdrop-blur-md">
        <div className="flex items-center gap-3 border-r border-stone-200 pr-6">
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-indigo-500 text-[10px] font-bold text-white">2</span>
          <span className="text-xs font-bold text-stone-600">Tasks Selected</span>
        </div>
        <div className="flex items-center gap-4">
          {[
            { icon: "assignment_turned_in", label: "Status",   hover: "hover:text-indigo-500" },
            { icon: "calendar_month",       label: "Due Date", hover: "hover:text-violet-500" },
            { icon: "person_add",           label: "Assign",   hover: "hover:text-emerald-500" },
            { icon: "delete",               label: "Delete",   hover: "hover:text-red-500" },
          ].map(({ icon, label, hover }) => (
            <button key={icon} className="group flex flex-col items-center gap-0.5">
              <span className={`material-symbols-outlined text-[20px] text-stone-400 transition-colors ${hover}`}>{icon}</span>
              <span className={`text-[10px] font-bold uppercase text-stone-400 transition-colors ${hover}`}>{label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* ── Detail Drawer ── */}
      {selectedTask && (
        <DetailTask task={selectedTask} onClose={() => setSelectedTask(null)} />
      )}
    </div>
  );
};

export default ListView;