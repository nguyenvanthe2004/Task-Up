import React, { useState, useCallback, useEffect } from "react";
import { Task, UpdateTask } from "../../types/task";
import { Status } from "../../types/status";
import { priorityBadge, priorityColor } from "../../constants";
import { callUpdateTask, callGetTaskByUser } from "../../services/task";
import { callGetStatuses } from "../../services/status";
import { toastError, toastSuccess } from "../../lib/toast";
import { AvatarStack } from "../ui/AvatarStack";
import { fmtDate } from "../../lib/until";
import DetailTask from "../tasks/DetailTask";
import NotFound from "../ui/NotFound";
import BulkStatusModal from "../tools/BulkStatusModal";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";

interface StatusGroup {
  status: Status;
  tasks: Task[];
}

const MyTaskBoardView: React.FC = () => {
  const user = useSelector((state: RootState) => state.auth.currentUser);

  const [statusGroups, setStatusGroups] = useState<StatusGroup[]>([]);
  const [statuses, setStatuses] = useState<Status[]>([]);
  const [selected, setSelected] = useState<Task | null>(null);
  const [checkedIds, setCheckedIds] = useState<Set<number>>(new Set());
  const [loading, setLoading] = useState(false);
  const [bulkStatusOpen, setBulkStatusOpen] = useState(false);
  const [bulkActionLoading, setBulkActionLoading] = useState(false);

  const [dragging, setDragging] = useState<{ taskId: number; fromStatusId: number } | null>(null);
  const [dragOver, setDragOver] = useState<number | null>(null);

  const fetchData = useCallback(async () => {
    if (!user?.id) return;
    setLoading(true);
    try {
      const [taskRes, statusRes] = await Promise.all([
        callGetTaskByUser(user.id),
        callGetStatuses(),
      ]);

      const sts: Status[] = statusRes.data;
      const sorted = [...sts].sort((a, b) => a.position - b.position);
      setStatuses(sorted);

      const tasks: Task[] = taskRes.data ?? [];
      const taskMap = new Map<number, Task[]>();
      for (const task of tasks) {
        if (task.statusId) {
          if (!taskMap.has(task.statusId)) taskMap.set(task.statusId, []);
          taskMap.get(task.statusId)!.push(task);
        }
      }

      setStatusGroups(sorted.map((s) => ({ status: s, tasks: taskMap.get(s.id) ?? [] })));
    } catch {
      toastError("Failed to load tasks.");
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleUpdateStatus = async (taskId: number, statusId: number) => {
    try {
      await callUpdateTask(taskId, { statusId } as UpdateTask);
      await fetchData();
    } catch {
      toastError("Failed to update status.");
    }
  };

  const handleBulkStatus = async (statusId: number) => {
    try {
      setBulkActionLoading(true);
      await Promise.all(
        [...checkedIds].map((id) => callUpdateTask(id, { statusId } as any))
      );
      toastSuccess("Status updated.");
      setBulkStatusOpen(false);
      setCheckedIds(new Set());
      await fetchData();
    } catch {
      toastError("Failed to update status.");
    } finally {
      setBulkActionLoading(false);
    }
  };

  const toggleCheck = (id: number) => {
    setCheckedIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const handleDrop = (toStatusId: number) => {
    if (!dragging) return;
    const { taskId, fromStatusId } = dragging;

    if (fromStatusId === toStatusId) {
      setDragging(null);
      setDragOver(null);
      return;
    }

    setStatusGroups((prev) => {
      let moved: Task | undefined;
      const without = prev.map((sg) => {
        if (sg.status.id !== fromStatusId) return sg;
        moved = sg.tasks.find((t) => t.id === taskId);
        return { ...sg, tasks: sg.tasks.filter((t) => t.id !== taskId) };
      });
      if (!moved) return prev;
      return without.map((sg) =>
        sg.status.id === toStatusId ? { ...sg, tasks: [moved!, ...sg.tasks] } : sg
      );
    });

    handleUpdateStatus(taskId, toStatusId);
    setDragging(null);
    setDragOver(null);
  };

  if (loading) {
    return (
      <div className="w-full mt-6 flex gap-3 overflow-x-auto pb-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="flex-none w-60 rounded-2xl border border-stone-200/60 bg-white/60 animate-pulse">
            <div className="px-3 pt-3 pb-2.5 flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-stone-200" />
              <div className="h-3 w-16 rounded bg-stone-200" />
            </div>
            <div className="px-2.5 pb-3 space-y-2">
              {[1, 2, 3].map((j) => (
                <div key={j} className="h-28 rounded-xl bg-stone-100" />
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  }

  const allEmpty = statusGroups.every((sg) => sg.tasks.length === 0);

  if (allEmpty) return <NotFound />;

  return (
    <div className="w-full mt-6">
      {/* Board */}
      <div
        className="flex items-start gap-3 pb-4"
        style={{ overflowX: "auto", scrollbarWidth: "thin", scrollbarColor: "#e7e5e4 transparent" }}
      >
        {statusGroups.map((sg) => {
          const isDone = sg.status.name.toLowerCase() === "done" || sg.status.name.toLowerCase() === "closed";
          const isOver = dragOver === sg.status.id;

          return (
            <section
              key={sg.status.id}
              className={`
                flex-none flex flex-col
                w-[240px] sm:w-[260px] lg:w-64
                rounded-2xl border transition-all duration-150
                ${isOver
                  ? "border-indigo-300 bg-indigo-50/50 shadow-lg"
                  : "border-stone-200/60 bg-white/60"
                }
              `}
              onDragOver={(e) => { e.preventDefault(); setDragOver(sg.status.id); }}
              onDragLeave={() => setDragOver(null)}
              onDrop={() => handleDrop(sg.status.id)}
            >
              {/* Column header */}
              <div className="flex items-center gap-2 px-3 pt-3 pb-2.5">
                <span
                  className="w-2 h-2 rounded-full flex-none"
                  style={{ backgroundColor: sg.status.color }}
                />
                <span className="text-[11px] font-bold text-stone-600 uppercase tracking-widest truncate flex-1">
                  {sg.status.name}
                </span>
                <span className="text-[10px] font-bold text-stone-400 bg-stone-100 rounded-full px-1.5 py-0.5 flex-none">
                  {sg.tasks.length}
                </span>
              </div>

              {/* Cards */}
              <div
                className="flex-1 px-2.5 pb-2 space-y-2 overflow-y-auto"
                style={{
                  maxHeight: "calc(100vh - 64px - 130px - 48px - 24px)",
                  scrollbarWidth: "thin",
                  scrollbarColor: "#e7e5e4 transparent",
                }}
              >
                {sg.tasks.length === 0 && (
                  <div className="flex flex-col items-center justify-center py-8 text-stone-300">
                    <svg className="w-5 h-5 mb-1" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                    <p className="text-[11px] font-medium">No tasks</p>
                  </div>
                )}

                {sg.tasks.map((task) => {
                  const overdue = task.dueDate && new Date(task.dueDate) < new Date();
                  const isChecked = checkedIds.has(task.id);

                  return (
                    <div
                      key={task.id}
                      draggable
                      onDragStart={() => setDragging({ taskId: task.id, fromStatusId: sg.status.id })}
                      onDragEnd={() => { setDragging(null); setDragOver(null); }}
                      className={dragging?.taskId === task.id ? "opacity-40" : ""}
                    >
                      <div
                        className={`
                          group relative bg-white rounded-xl border shadow-sm
                          hover:shadow-md hover:-translate-y-0.5 transition-all duration-150 p-3
                          ${isChecked ? "border-indigo-300 bg-indigo-50/30 ring-1 ring-indigo-200" : "border-stone-100"}
                          ${isDone ? "opacity-55" : ""}
                        `}
                      >
                        {/* Top row: checkbox + priority */}
                        <div className="flex items-center justify-between mb-2 gap-2">
                          <div className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={(e) => { e.stopPropagation(); toggleCheck(task.id); }}
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
                                  style={{ backgroundColor: priorityColor[task.priority] ?? "#78716c" }}
                                />
                                {task.priority}
                              </span>
                            )}
                          </div>

                          {/* Drag handle */}
                          <span className="material-symbols-outlined text-[15px] text-stone-200 group-hover:text-stone-300 cursor-grab select-none transition-colors flex-none">
                            drag_indicator
                          </span>
                        </div>

                        {/* Title */}
                        <p
                          onClick={() => setSelected(task)}
                          className={`text-[13px] font-semibold leading-snug mb-1.5 cursor-pointer hover:text-indigo-600 transition-colors ${
                            isDone ? "line-through text-stone-400" : "text-stone-700"
                          }`}
                        >
                          {task.name}
                        </p>

                        {/* Breadcrumb: space / category / list */}
                        <div className="flex flex-wrap items-center gap-1 mb-2.5 text-[10px] text-stone-400 font-medium">
                          {task.list?.category?.space?.name && (
                            <>
                              <span className="truncate max-w-[60px]">{task.list.category.space.name}</span>
                              <span className="text-stone-300">/</span>
                            </>
                          )}
                          {task.list?.category?.name && (
                            <>
                              <span className="truncate max-w-[60px]">{task.list.category.name}</span>
                              <span className="text-stone-300">/</span>
                            </>
                          )}
                          {task.list?.name && (
                            <span className="truncate max-w-[60px]">{task.list.name}</span>
                          )}
                        </div>

                        {/* Tag */}
                        {task.tag && (
                          <div className="mb-2">
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-500 text-[10px] font-semibold">
                              #{task.tag}
                            </span>
                          </div>
                        )}

                        {/* Footer: status + avatar */}
                        <div className="flex items-center justify-between gap-2 mt-2.5">
                          {(() => {
                            const s = statuses.find((st) => st.id === task.statusId);
                            return s ? (
                              <span
                                className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold whitespace-nowrap"
                                style={{
                                  backgroundColor: `${s.color}18`,
                                  color: s.color,
                                  border: `1px solid ${s.color}30`,
                                }}
                              >
                                <span className="h-1.5 w-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: s.color }} />
                                {s.name}
                              </span>
                            ) : <span />;
                          })()}

                          {task.assignees && task.assignees.length > 0 && (
                            <AvatarStack members={task.assignees} />
                          )}
                        </div>

                        {/* Date range */}
                        {(task.startDate || task.dueDate) && (
                          <div className="flex items-center gap-1.5 mt-2 text-[10px] font-medium tabular-nums text-stone-400">
                            <svg className="w-3 h-3 flex-shrink-0 text-stone-300" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                              <rect x="3" y="4" width="18" height="18" rx="2" />
                              <path strokeLinecap="round" d="M16 2v4M8 2v4M3 10h18" />
                            </svg>
                            {task.startDate && <span>{fmtDate(task.startDate)}</span>}
                            {task.startDate && task.dueDate && <span className="text-stone-300">→</span>}
                            {task.dueDate && (
                              <span className={overdue ? "text-red-400 font-semibold" : ""}>
                                {fmtDate(task.dueDate)}
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          );
        })}
      </div>

      {/* Bulk action bar */}
      {checkedIds.size > 0 && (
        <>
          <BulkStatusModal
            isOpen={bulkStatusOpen}
            statuses={statuses}
            loading={bulkActionLoading}
            onSelect={handleBulkStatus}
            onClose={() => setBulkStatusOpen(false)}
          />

          <div className="fixed bottom-8 left-1/2 z-40 -translate-x-1/2 flex items-center gap-5 rounded-2xl border border-stone-200/60 bg-white/90 px-5 py-2.5 shadow-2xl backdrop-blur-md">
            <div className="flex items-center gap-2.5 border-r border-stone-200 pr-5">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-indigo-500 text-[10px] font-bold text-white">
                {checkedIds.size}
              </span>
              <span className="text-xs font-bold text-stone-600">Selected</span>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setBulkStatusOpen(true)}
                className="flex flex-col items-center gap-0.5 rounded-xl p-2 hover:text-indigo-500 hover:bg-indigo-50 transition-colors"
              >
                <span className="material-symbols-outlined text-[18px] text-stone-400">assignment_turned_in</span>
                <span className="text-[9px] font-bold uppercase text-stone-400">Status</span>
              </button>
              <button
                onClick={() => setCheckedIds(new Set())}
                className="flex flex-col items-center gap-0.5 rounded-xl p-2 hover:text-red-400 hover:bg-red-50 transition-colors"
              >
                <span className="material-symbols-outlined text-[18px] text-stone-400">close</span>
                <span className="text-[9px] font-bold uppercase text-stone-400">Clear</span>
              </button>
            </div>
          </div>
        </>
      )}

      {/* Detail drawer */}
      {selected && (
        <DetailTask
          task={selected}
          statuses={statuses}
          onClose={() => setSelected(null)}
          onUpdate={(data: UpdateTask) =>
            handleUpdateStatus(selected.id, (data as any).statusId)
          }
          onDelete={() => {}}
        />
      )}
    </div>
  );
};

export default MyTaskBoardView;