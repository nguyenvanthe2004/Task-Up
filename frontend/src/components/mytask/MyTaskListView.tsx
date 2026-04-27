import React, { useState, useCallback, useEffect } from "react";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "@hello-pangea/dnd";
import { Task, UpdateTask } from "../../types/task";
import { Status } from "../../types/status";
import { priorityBadge } from "../../constants";
import { callUpdateTask, callGetTaskByUser } from "../../services/task";
import { callGetStatuses } from "../../services/status";
import { toastError, toastSuccess } from "../../lib/toast";
import { AvatarStack } from "../ui/AvatarStack";
import { fmtDate } from "../../lib/until";

import DetailTask from "../tasks/DetailTask";
import NotFound from "../ui/NotFound";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { GRID_COLS } from "../tools/InlineCreateRow";
import BulkStatusModal from "../tools/BulkStatusModal";

interface StatusGroup {
  status: Status;
  tasks: Task[];
}

const MyTaskListView: React.FC = () => {
  const user = useSelector((state: RootState) => state.auth.currentUser);

  const [statusGroups, setStatusGroups] = useState<StatusGroup[]>([]);
  const [statuses, setStatuses] = useState<Status[]>([]);
  const [selected, setSelected] = useState<Task | null>(null);
  const [checkedIds, setCheckedIds] = useState<Set<number>>(new Set());
  const [loading, setLoading] = useState(false);
  const [bulkStatusOpen, setBulkStatusOpen] = useState(false);
  const [bulkActionLoading, setBulkActionLoading] = useState(false);

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

      setStatusGroups(
        sorted.map((s) => ({
          status: s,
          tasks: taskMap.get(s.id) ?? [],
        })),
      );
    } catch {
      toastError("Failed to load tasks.");
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

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
        [...checkedIds].map((id) => callUpdateTask(id, { statusId } as any)),
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

  const onDragEnd = ({ source, destination, draggableId }: DropResult) => {
    if (!destination) return;
    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    )
      return;

    const taskId = Number(draggableId);
    const fromStatusId = Number(source.droppableId);
    const toStatusId = Number(destination.droppableId);

    setStatusGroups((prev) => {
      let moved: Task | undefined;
      const withoutSource = prev.map((sg) => {
        if (sg.status.id !== fromStatusId) return sg;
        moved = sg.tasks[source.index];
        return { ...sg, tasks: sg.tasks.filter((_, i) => i !== source.index) };
      });
      if (!moved) return prev;
      return withoutSource.map((sg) => {
        if (sg.status.id !== toStatusId) return sg;
        const updated = [...sg.tasks];
        updated.splice(destination.index, 0, moved!);
        return { ...sg, tasks: updated };
      });
    });

    if (fromStatusId !== toStatusId) {
      handleUpdateStatus(taskId, toStatusId);
    }
  };

  const HEADERS = [
    "Task Name",
    "Assignees",
    "Status",
    "Priority",
    "Start Date",
    "Due Date",
    "Tag",
  ];

  const makeColumns = (groupTasks: Task[]) => [
    {
      key: "name",
      render: (row: Task) => {
        const index = groupTasks.findIndex((t) => t.id === row.id);
        return (
          <Draggable draggableId={String(row.id)} index={index} key={row.id}>
            {(provided, snapshot) => (
              <div
                ref={provided.innerRef}
                {...provided.draggableProps}
                className={`flex flex-col gap-1 cursor-pointer group/row ${
                  snapshot.isDragging ? "opacity-50" : ""
                }`}
              >
                <div
                  onClick={() => setSelected(row)}
                  className="flex items-center gap-2.5"
                >
                  <span
                    {...provided.dragHandleProps}
                    className="material-symbols-outlined text-[18px] text-stone-200 group-hover/row:text-indigo-300 cursor-grab flex-shrink-0"
                  >
                    drag_indicator
                  </span>

                  <input
                    type="checkbox"
                    checked={checkedIds.has(row.id)}
                    onClick={(e) => e.stopPropagation()}
                    onChange={() =>
                      setCheckedIds((p) => {
                        const n = new Set(p);
                        n.has(row.id) ? n.delete(row.id) : n.add(row.id);
                        return n;
                      })
                    }
                    className="accent-indigo-500 w-4 h-4 rounded-full"
                  />

                  <span className="text-[13px] font-medium text-stone-700 truncate">
                    {row.name}
                  </span>
                </div>

                <div className="ml-[55px] text-[11px] text-stone-400 flex flex-wrap items-center gap-1">
                  {row.list?.category?.space?.name}
                  <span className="text-stone-300">/</span>
                  {row.list?.category?.name}
                  <span className="text-stone-300">/</span>
                  {row.list?.name}
                </div>
              </div>
            )}
          </Draggable>
        );
      },
    },
    {
      key: "assignees",
      render: (row: Task) => (
        <div className="flex mt-5">
          <AvatarStack members={row.assignees ?? []} />
        </div>
      ),
    },
    {
      key: "status",
      render: (row: Task) => {
        const s = statuses.find((st) => st.id === row.statusId);
        return s ? (
          <span
            className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold whitespace-nowrap"
            style={{
              backgroundColor: `${s.color}18`,
              color: s.color,
              border: `1px solid ${s.color}30`,
            }}
          >
            <span
              className="h-1.5 w-1.5 rounded-full flex-shrink-0"
              style={{ backgroundColor: s.color }}
            />
            {s.name}
          </span>
        ) : (
          <span className="text-xs text-stone-300">—</span>
        );
      },
    },
    {
      key: "priority",
      render: (row: Task) =>
        row.priority ? (
          <span
            className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold ${priorityBadge[row.priority] ?? "bg-stone-50 text-stone-500"}`}
          >
            <span className="h-1.5 w-1.5 rounded-full bg-current opacity-60 flex-shrink-0" />
            {row.priority}
          </span>
        ) : (
          <span className="text-xs text-stone-300">—</span>
        ),
    },
    {
      key: "startDate",
      render: (row: Task) => (
        <span className="text-[12px] text-stone-400 font-medium tabular-nums">
          {fmtDate(row.startDate)}
        </span>
      ),
    },
    {
      key: "dueDate",
      render: (row: Task) => {
        const overdue = row.dueDate && new Date(row.dueDate) < new Date();
        return (
          <span
            className={`text-[12px] font-medium tabular-nums ${overdue ? "text-red-400" : "text-stone-400"}`}
          >
            {fmtDate(row.dueDate)}
          </span>
        );
      },
    },
    {
      key: "tag",
      render: (row: Task) =>
        row.tag ? (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-500 text-[10px] font-semibold">
            #{row.tag}
          </span>
        ) : (
          <span className="text-xs text-stone-300">—</span>
        ),
    },
  ];

  const renderStatusGroup = (sg: StatusGroup) => {
    const droppableId = String(sg.status.id);

    return (
      <Droppable droppableId={droppableId} key={droppableId}>
        {(provided) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className="mb-4"
          >
            {/* status header */}
            <div className="flex items-center gap-2 mb-1.5 px-1">
              <span
                className="h-2 w-2 rounded-full flex-shrink-0"
                style={{ backgroundColor: sg.status.color }}
              />
              <span className="text-[11px] font-semibold text-stone-500 tracking-wide uppercase">
                {sg.status.name}
              </span>
              <span className="flex h-4 min-w-4 items-center justify-center rounded-full bg-stone-100 px-1 text-[9px] font-bold text-stone-400">
                {sg.tasks.length}
              </span>
            </div>

            {/* table */}
            <div className="rounded-xl border border-stone-100 bg-white overflow-visible shadow-sm">
              <div
                className="grid items-center border-b border-stone-50 bg-stone-50/80 px-3 py-2 rounded-t-xl"
                style={{ gridTemplateColumns: GRID_COLS }}
              >
                {HEADERS.map((h, i) => (
                  <span
                    key={i}
                    className="text-[10px] font-bold uppercase tracking-widest text-stone-400 px-1"
                  >
                    {h}
                  </span>
                ))}
              </div>

              <div className="divide-y divide-stone-50">
                {sg.tasks.length === 0 ? (
                  <div className="py-4 text-center text-xs text-stone-300 font-medium">
                    No tasks
                  </div>
                ) : (
                  sg.tasks.map((task) => (
                    <div
                      key={task.id}
                      className="grid items-center px-3 py-2.5 hover:bg-stone-50/70 transition-colors"
                      style={{ gridTemplateColumns: GRID_COLS }}
                    >
                      {makeColumns(sg.tasks).map((col) => (
                        <div key={col.key} className="px-1 min-w-0">
                          {col.render(task)}
                        </div>
                      ))}
                    </div>
                  ))
                )}
              </div>
            </div>

            {provided.placeholder}
          </div>
        )}
      </Droppable>
    );
  };

  return (
    <div className="w-full">
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse space-y-1.5">
              <div className="h-4 w-24 rounded-md bg-stone-100" />
              {[1, 2, 3].map((k) => (
                <div key={k} className="h-10 rounded-xl bg-stone-100/80" />
              ))}
            </div>
          ))}
        </div>
      ) : (
        <DragDropContext onDragEnd={onDragEnd}>
          {statusGroups.every((sg) => sg.tasks.length === 0) ? (
            <NotFound />
          ) : (
            statusGroups.map(renderStatusGroup)
          )}
        </DragDropContext>
      )}

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
                <span className="material-symbols-outlined text-[18px] text-stone-400">
                  assignment_turned_in
                </span>
                <span className="text-[9px] font-bold uppercase text-stone-400">
                  Status
                </span>
              </button>
              <button
                onClick={() => setCheckedIds(new Set())}
                className="flex flex-col items-center gap-0.5 rounded-xl p-2 hover:text-red-400 hover:bg-red-50 transition-colors"
              >
                <span className="material-symbols-outlined text-[18px] text-stone-400">
                  close
                </span>
                <span className="text-[9px] font-bold uppercase text-stone-400">
                  Close
                </span>
              </button>
            </div>
          </div>
        </>
      )}

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

export default MyTaskListView;
