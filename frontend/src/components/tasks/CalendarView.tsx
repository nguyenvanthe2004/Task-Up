import React, {
  useState,
  useCallback,
  useEffect,
  useRef,
  useImperativeHandle,
  forwardRef,
} from "react";
import dayjs from "dayjs";
import { useParams } from "react-router-dom";
import { ListViewHandle, Member, Task, UpdateTask } from "../../types/task";
import { Status } from "../../types/status";
import { priorityBadge, priorityColor, WEEKDAYS } from "../../constants";
import {
  callGetTasks,
  callUpdateTask,
  callDeleteTask,
} from "../../services/task";
import { callGetStatuses } from "../../services/status";
import { callGetSpaceMembers } from "../../services/space";
import { toastError, toastSuccess } from "../../lib/toast";
import { buildCells, fmtDate } from "../../lib/until";
import { useModal } from "../../hook/useModal";
import DetailTask from "./DetailTask";
import ConfirmDeleteModal from "../ui/ConfirmDeleteModal";
import BulkStatusModal from "../tools/BulkStatusModal";
import BulkAssignModal from "../tools/BulkAssignModal";
import MiniMonth from "../ui/MiniMonth";
import { AvatarStack } from "../ui/AvatarStack";
import { InlineDayEdit } from "../tools/InlineDayEdit";
import { InlineDayCreate } from "../tools/InlineDayCreate";

const CalendarView = forwardRef<ListViewHandle>((_, ref) => {
  const { listId, spaceId } = useParams<{ listId: string; spaceId: string }>();

  const today = dayjs();
  const [current, setCurrent] = useState(today.date(1));
  const [tasks, setTasks] = useState<Task[]>([]);
  const [statuses, setStatuses] = useState<Status[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(false);

  const [selected, setSelected] = useState<Task | null>(null);
  const [checkedIds, setCheckedIds] = useState<Set<number>>(new Set());
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [editingTaskId, setEditingTaskId] = useState<number | null>(null);

  const [openCreateDate, setOpenCreateDate] = useState<string | null>(null);

  const [bulkStatusOpen, setBulkStatusOpen] = useState(false);
  const [bulkAssignOpen, setBulkAssignOpen] = useState(false);
  const [bulkActionLoading, setBulkActionLoading] = useState(false);

  const [dragId, setDragId] = useState<number | null>(null);

  const [sidebarOpen, setSidebarOpen] = useState(true);

  const { isOpen, open, close } = useModal();
  const cells = buildCells(current);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [taskRes, statusRes, memberRes] = await Promise.all([
        callGetTasks(Number(listId)),
        callGetStatuses(),
        callGetSpaceMembers(Number(spaceId)),
      ]);
      setTasks(taskRes.data ?? []);
      const sorted = [...(statusRes.data as Status[])].sort(
        (a, b) => a.position - b.position,
      );
      setStatuses(sorted);
      setMembers(memberRes.data.members ?? []);
    } catch {
      toastError("Failed to load.");
    } finally {
      setLoading(false);
    }
  }, [listId, spaceId]);

  useImperativeHandle(ref, () => ({
    refresh: fetchData,
    getTasks: () => tasks,
  }));

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleUpdate = async (id: number, data: UpdateTask) => {
    try {
      await callUpdateTask(id, data);
      setTasks((prev) =>
        prev.map((t) => (t.id === id ? { ...t, ...data } : t)),
      );
    } catch {
      toastError("Failed to update.");
    }
  };

  const handleBulkDelete = async () => {
    try {
      setDeleting(true);
      await Promise.all([...checkedIds].map(callDeleteTask));
      toastSuccess(`${checkedIds.size} tasks deleted!`);
      close();
      setCheckedIds(new Set());
      setTasks((prev) => prev.filter((t) => !checkedIds.has(t.id)));
    } catch {
      toastError("Failed to delete.");
    } finally {
      setDeleting(false);
    }
  };

  const handleBulkStatus = async (statusId: number) => {
    try {
      const ids = [...checkedIds];
      setBulkActionLoading(true);
      await Promise.all(
        [...checkedIds].map((id) =>
          callUpdateTask(id, { statusId } as UpdateTask),
        ),
      );
      toastSuccess("Status updated.");
      setBulkStatusOpen(false);
      setCheckedIds(new Set());
      setTasks((prev) =>
        prev.map((t) => (ids.includes(t.id) ? { ...t, statusId } : t)),
      );
    } catch {
      toastError("Failed.");
    } finally {
      setBulkActionLoading(false);
    }
  };

  const handleBulkAssign = async (memberIds: number[]) => {
    try {
      setBulkActionLoading(true);
      await Promise.all(
        [...checkedIds].map((id) =>
          callUpdateTask(id, { assigneeIds: memberIds } as UpdateTask),
        ),
      );
      toastSuccess("Assigned.");
      setBulkAssignOpen(false);
      setCheckedIds(new Set());
      setTasks((prev) =>
        prev.map((t) =>
          checkedIds.has(t.id) ? { ...t, assigneeIds: memberIds } : t,
        ),
      );
    } catch {
      toastError("Failed.");
    } finally {
      setBulkActionLoading(false);
    }
  };

  const toggleCheck = (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setCheckedIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const tasksForDate = (dateStr: string) =>
    tasks.filter((t) => t.dueDate && t.dueDate.slice(0, 10) === dateStr);

  const unscheduled = tasks.filter((t) => !t.dueDate);

  const handleDropOnCell = (dateStr: string) => {
    if (!dragId) return;
    handleUpdate(dragId, { dueDate: dateStr } as UpdateTask);
    setDragId(null);
  };

  const firstStatusId = statuses[0]?.id;

  const renderPill = (task: Task, compact = false) => {
    const status = statuses.find((s) => s.id === task.statusId);
    const isChecked = checkedIds.has(task.id);

    if (editingTaskId === task.id) {
      return (
        <InlineDayEdit
          key={task.id}
          task={task}
          statuses={statuses}
          members={members}
          onClose={() => setEditingTaskId(null)}
          onSaved={handleUpdate}
        />
      );
    }

    return (
      <div
        key={task.id}
        draggable
        onDragStart={(e) => {
          e.stopPropagation();
          setDragId(task.id);
        }}
        onDragEnd={() => setDragId(null)}
        onClick={(e) => {
          e.stopPropagation();
          setSelected(task);
        }}
        className={`
          group/pill relative flex items-center gap-1.5 px-2 py-0.5 rounded-md cursor-pointer
          hover:opacity-90 transition-all text-[10px] font-semibold truncate
          border-l-2
          ${isChecked ? "ring-1 ring-indigo-400 ring-offset-0" : ""}
          ${dragId === task.id ? "opacity-40" : ""}
        `}
        style={{
          backgroundColor: status ? `${status.color}15` : "#f5f5f4",
          color: status?.color ?? "#78716c",
          borderLeftColor: status?.color ?? "#d6d3d1",
        }}
      >
        {/* Checkbox on hover */}
        <input
          type="checkbox"
          checked={isChecked}
          onChange={() => {}}
          onClick={(e) => toggleCheck(task.id, e)}
          className="accent-indigo-500 w-3 h-3 rounded flex-none opacity-0 group-hover/pill:opacity-100 transition-opacity"
          style={isChecked ? { opacity: 1 } : {}}
        />
        <span className="truncate flex-1">{task.name}</span>
        {task.priority && !compact && (
          <span
            className="w-1.5 h-1.5 rounded-full flex-none"
            style={{
              backgroundColor: priorityColor[task.priority] ?? "#78716c",
            }}
          />
        )}
        {/* Edit on hover */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            setEditingTaskId(task.id);
          }}
          className="opacity-0 group-hover/pill:opacity-100 flex-none text-current transition-opacity"
        >
          <svg
            className="w-2.5 h-2.5"
            fill="none"
            stroke="currentColor"
            strokeWidth={2.5}
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15.232 5.232l3.536 3.536M9 13l6.5-6.5a2 2 0 112.828 2.828L11.828 15.828a2 2 0 01-1.414.586H9v-2a2 2 0 01.586-1.414z"
            />
          </svg>
        </button>
      </div>
    );
  };

  // ── Skeleton ────────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div
        className="w-full mt-4 rounded-xl border border-stone-200/60 bg-white/60 animate-pulse"
        style={{ minHeight: "calc(100vh - 200px)" }}
      >
        <div className="h-12 border-b border-stone-100 bg-stone-50/80 rounded-t-xl" />
        <div className="grid grid-cols-7">
          {Array.from({ length: 35 }).map((_, i) => (
            <div
              key={i}
              className="border-r border-b border-stone-100 p-2 min-h-[100px]"
            >
              <div className="w-5 h-5 rounded-full bg-stone-200 mb-2" />
              <div className="space-y-1">
                <div className="h-3 rounded bg-stone-100" />
                <div className="h-3 rounded bg-stone-100 w-3/4" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // ── Main ────────────────────────────────────────────────────────────────────
  return (
    <div
      className="w-full mt-4 flex gap-0 overflow-hidden rounded-xl border border-stone-200/60 bg-white/60"
      style={{ minHeight: "calc(100vh - 200px)" }}
    >
      {/* ── Calendar main ── */}
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-stone-100 bg-white/80 flex-wrap gap-2">
          <div className="flex items-center gap-2">
            {/* Sidebar toggle */}
            <button
              onClick={() => setSidebarOpen((v) => !v)}
              className="p-1.5 rounded-lg text-stone-400 hover:bg-stone-100 transition-colors"
              title={sidebarOpen ? "Hide sidebar" : "Show sidebar"}
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4 6h16M4 12h10M4 18h16"
                />
              </svg>
            </button>

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

            <span className="text-sm font-bold text-stone-800 min-w-[120px] text-center">
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

          {/* Task count summary */}
          <div className="flex items-center gap-3 text-[11px] font-medium text-stone-400">
            <span>{tasks.length} tasks</span>
            <span className="text-stone-200">|</span>
            <span className="text-amber-500">
              {unscheduled.length} unscheduled
            </span>
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
            const dateStr = cell.date.format("YYYY-MM-DD");
            const dayTasks = cell.cur ? tasksForDate(dateStr) : [];
            const isToday =
              cell.cur &&
              current.isSame(today, "month") &&
              cell.day === today.date();
            const isCreating = openCreateDate === dateStr && cell.cur;
            const isCellOverdue =
              cell.cur &&
              dayTasks.length > 0 &&
              cell.date.isBefore(today, "day");
            const MAX_VISIBLE = 3;

            return (
              <div
                key={i}
                className={`
                border-r border-b border-stone-100 p-1.5 min-h-[110px] relative
                transition-colors group/cell
                ${!cell.cur ? "bg-stone-50/40" : isCellOverdue ? "bg-red-50/60" : "hover:bg-indigo-50/20"}
                ${isCellOverdue ? "border-red-100" : ""}
                ${i % 7 === 6 ? "border-r-0" : ""}
                `}
                onDragOver={(e) => {
                  if (cell.cur) e.preventDefault();
                }}
                onDrop={() => {
                  if (cell.cur) handleDropOnCell(dateStr);
                }}
                onClick={() => {
                  if (!cell.cur || isCreating) return;
                  setOpenCreateDate(dateStr);
                  setEditingTaskId(null);
                }}
              >
                {/* Day number */}
                <div className="flex items-center justify-between mb-1">
                  <span
                    className={`
                      inline-flex w-6 h-6 items-center justify-center rounded-full text-xs font-bold
                      ${!cell.cur ? "text-stone-300" : isToday ? "bg-indigo-600 text-white" : "text-stone-600 group-hover/cell:text-indigo-600"}
                    `}
                  >
                    {cell.day}
                  </span>
                  {/* Add button on hover */}
                  {cell.cur && !isCreating && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setOpenCreateDate(dateStr);
                        setEditingTaskId(null);
                      }}
                      className="opacity-0 group-hover/cell:opacity-100 p-0.5 rounded text-stone-300 hover:text-indigo-500 transition-all"
                    >
                      <svg
                        className="w-3 h-3"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={2.5}
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M12 4v16m8-8H4"
                        />
                      </svg>
                    </button>
                  )}
                </div>

                {/* Pills */}
                <div className="space-y-0.5">
                  {dayTasks
                    .slice(0, MAX_VISIBLE)
                    .map((t) => renderPill(t, true))}
                  {dayTasks.length > MAX_VISIBLE && (
                    <div className="text-[10px] font-bold text-stone-400 px-1">
                      +{dayTasks.length - MAX_VISIBLE} more
                    </div>
                  )}
                </div>

                {/* Inline create */}
                {isCreating && (
                  <InlineDayCreate
                    date={dateStr}
                    statusId={firstStatusId}
                    listId={listId}
                    members={members}
                    statuses={statuses}
                    onClose={() => setOpenCreateDate(null)}
                    onCreated={() => {
                      setOpenCreateDate(null);
                      fetchData();
                    }}
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Sidebar ── */}
      {sidebarOpen && (
        <aside
          className="w-56 lg:w-64 flex-none border-l border-stone-100 bg-stone-50/40 flex flex-col overflow-y-auto transition-all"
          style={{
            scrollbarWidth: "thin",
            scrollbarColor: "#e7e5e4 transparent",
          }}
        >
          {/* Status filter */}
          <div className="p-4 border-b border-stone-100">
            <h3 className="text-[10px] font-bold tracking-[0.15em] text-stone-400 uppercase mb-3">
              Status
            </h3>
            <div className="space-y-1.5">
              {statuses.map((s) => {
                const count = tasks.filter((t) => t.statusId === s.id).length;
                return (
                  <div key={s.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: s.color }}
                      />
                      <span className="text-xs font-medium text-stone-600">
                        {s.name}
                      </span>
                    </div>
                    <span className="text-[10px] font-bold text-stone-400 bg-stone-100 rounded-full px-1.5 py-0.5">
                      {count}
                    </span>
                  </div>
                );
              })}
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
              {unscheduled.map((t) => {
                const status = statuses.find((s) => s.id === t.statusId);
                const isChecked = checkedIds.has(t.id);

                return (
                  <div
                    key={t.id}
                    draggable
                    onDragStart={() => setDragId(t.id)}
                    onDragEnd={() => setDragId(null)}
                    onClick={() => setSelected(t)}
                    className={`
                      p-2.5 bg-white rounded-xl border shadow-sm
                      hover:border-indigo-200 hover:shadow-md transition-all cursor-grab active:cursor-grabbing group/unsched
                      ${isChecked ? "border-indigo-300 ring-1 ring-indigo-200" : "border-stone-100"}
                      ${dragId === t.id ? "opacity-40" : ""}
                    `}
                  >
                    <div className="flex items-start gap-2">
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => {}}
                        onClick={(e) => toggleCheck(t.id, e)}
                        className="accent-indigo-500 w-3.5 h-3.5 mt-0.5 flex-none opacity-0 group-hover/unsched:opacity-100 transition-opacity"
                        style={isChecked ? { opacity: 1 } : {}}
                      />
                      <span className="text-[11px] font-semibold text-stone-700 leading-snug flex-1 group-hover/unsched:text-indigo-600 transition-colors">
                        {t.name}
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setEditingTaskId(t.id);
                        }}
                        className="opacity-0 group-hover/unsched:opacity-100 text-stone-300 hover:text-indigo-400 transition-all flex-none"
                      >
                        <svg
                          className="w-3 h-3"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth={2.5}
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M15.232 5.232l3.536 3.536M9 13l6.5-6.5a2 2 0 112.828 2.828L11.828 15.828a2 2 0 01-1.414.586H9v-2a2 2 0 01.586-1.414z"
                          />
                        </svg>
                      </button>
                    </div>

                    {/* Edit inline in sidebar */}
                    {editingTaskId === t.id && (
                      <div
                        className="mt-2"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <InlineDayEdit
                          task={t}
                          statuses={statuses}
                          members={members}
                          onClose={() => setEditingTaskId(null)}
                          onSaved={handleUpdate}
                        />
                      </div>
                    )}

                    <div className="mt-2 flex items-center gap-1.5 flex-wrap">
                      {status && (
                        <span
                          className="inline-flex items-center gap-1 rounded-full px-1.5 py-0.5 text-[9px] font-semibold"
                          style={{
                            backgroundColor: `${status.color}18`,
                            color: status.color,
                          }}
                        >
                          <span
                            className="w-1 h-1 rounded-full"
                            style={{ backgroundColor: status.color }}
                          />
                          {status.name}
                        </span>
                      )}
                      {t.priority && (
                        <span
                          className={`inline-flex items-center gap-1 text-[9px] font-semibold rounded px-1.5 py-0.5 ${priorityBadge[t.priority] ?? "bg-stone-50 text-stone-500"}`}
                        >
                          <span className="w-1 h-1 rounded-full bg-current opacity-70" />
                          {t.priority}
                        </span>
                      )}
                    </div>

                    {t.assignees && t.assignees.length > 0 && (
                      <div className="mt-1.5">
                        <AvatarStack members={t.assignees} />
                      </div>
                    )}
                  </div>
                );
              })}

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

          {/* Mini month next */}
          <div className="p-4 border-t border-stone-100">
            <MiniMonth d={current.add(1, "month")} />
          </div>
        </aside>
      )}

      {/* ── Bulk action bar ── */}
      {checkedIds.size > 0 && (
        <>
          <BulkStatusModal
            isOpen={bulkStatusOpen}
            statuses={statuses}
            loading={bulkActionLoading}
            onSelect={handleBulkStatus}
            onClose={() => setBulkStatusOpen(false)}
          />
          <BulkAssignModal
            isOpen={bulkAssignOpen}
            members={members}
            loading={bulkActionLoading}
            onSelect={handleBulkAssign}
            onClose={() => setBulkAssignOpen(false)}
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
                onClick={() => {
                  setBulkStatusOpen(true);
                  setBulkAssignOpen(false);
                }}
                className="flex flex-col items-center gap-0.5 rounded-xl p-2 hover:text-indigo-500 hover:bg-indigo-50 transition-colors"
              >
                <span className="material-symbols-outlined text-[18px] text-stone-400">
                  assignment_turned_in
                </span>
                <span className="text-[9px] font-bold uppercase text-stone-400">
                  Status
                </span>
              </button>
              <button
                onClick={() => {
                  setBulkAssignOpen(true);
                  setBulkStatusOpen(false);
                }}
                className="flex flex-col items-center gap-0.5 rounded-xl p-2 hover:text-emerald-500 hover:bg-emerald-50 transition-colors"
              >
                <span className="material-symbols-outlined text-[18px] text-stone-400">
                  person_add
                </span>
                <span className="text-[9px] font-bold uppercase text-stone-400">
                  Assign
                </span>
              </button>
              <button
                onClick={() => {
                  const id = [...checkedIds][0];
                  if (id) setEditingTaskId(id);
                }}
                className="flex flex-col items-center gap-0.5 rounded-xl p-2 hover:text-violet-500 hover:bg-violet-50 transition-colors"
              >
                <span className="material-symbols-outlined text-[18px] text-stone-400">
                  edit
                </span>
                <span className="text-[9px] font-bold uppercase text-stone-400">
                  Edit
                </span>
              </button>
              <button
                onClick={open}
                disabled={deleting}
                className="flex flex-col items-center gap-0.5 rounded-xl p-2 hover:text-red-500 hover:bg-red-50 transition-colors"
              >
                <span className="material-symbols-outlined text-[18px] text-stone-400">
                  delete
                </span>
                <span className="text-[9px] font-bold uppercase text-stone-400">
                  Delete
                </span>
              </button>
              <button
                onClick={() => setCheckedIds(new Set())}
                className="flex flex-col items-center gap-0.5 rounded-xl p-2 hover:text-stone-600 hover:bg-stone-100 transition-colors"
              >
                <span className="material-symbols-outlined text-[18px] text-stone-400">
                  close
                </span>
                <span className="text-[9px] font-bold uppercase text-stone-400">
                  Clear
                </span>
              </button>
            </div>
          </div>
        </>
      )}

      {/* ── Confirm delete ── */}
      <ConfirmDeleteModal
        isOpen={isOpen}
        loading={deleting}
        title="Delete Task?"
        description={`Delete ${checkedIds.size > 1 ? `${checkedIds.size} tasks` : "this task"}? This cannot be undone.`}
        onClose={() => {
          close();
          setDeleteId(null);
        }}
        onConfirm={handleBulkDelete}
      />

      {/* ── Detail drawer ── */}
      {selected && (
        <DetailTask
          task={selected}
          statuses={statuses}
          onClose={() => setSelected(null)}
          onUpdate={(data: UpdateTask) => handleUpdate(selected.id, data)}
          onDelete={() => {
            setDeleteId(selected.id);
            setCheckedIds(new Set([selected.id]));
            setSelected(null);
            open();
          }}
        />
      )}
    </div>
  );
});

export default CalendarView;
