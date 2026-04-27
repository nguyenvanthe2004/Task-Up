import React, {
  useState,
  useCallback,
  useImperativeHandle,
  forwardRef,
} from "react";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "@hello-pangea/dnd";
import { ListViewHandle, Member, Task, UpdateTask } from "../../types/task";
import { Status } from "../../types/status";
import DetailTask from "./DetailTask";
import { priorityBadge, PriorityStatus } from "../../constants";
import {
  callDeleteTask,
  callGetTasks,
  callUpdateTask,
} from "../../services/task";
import { callGetStatuses } from "../../services/status";
import { callGetSpaceMembers } from "../../services/space";
import { useParams } from "react-router-dom";
import { toastError, toastSuccess } from "../../lib/toast";
import { AvatarStack } from "../ui/AvatarStack";
import { fmtDate } from "../../lib/until";
import { useModal } from "../../hook/useModal";
import ConfirmDeleteModal from "../ui/ConfirmDeleteModal";

import { useEffect } from "react";
import { GRID_COLS, InlineCreateRow } from "../tools/InlineCreateRow";
import InlineEditRow from "../tools/InlineEditRow";
import BulkStatusModal from "../tools/BulkStatusModal";
import BulkAssignModal from "../tools/BulkAssignModal";

const ListView = forwardRef<ListViewHandle>((_, ref) => {
  const { listId, spaceId } = useParams<{ listId: string; spaceId: string }>();
  const [groups, setGroups] = useState<{ status: Status; tasks: Task[] }[]>([]);
  const [statuses, setStatuses] = useState<Status[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [selected, setSelected] = useState<Task | null>(null);
  const [checkedIds, setCheckedIds] = useState<Set<number>>(new Set());
  const [loading, setLoading] = useState(false);
  const [openInlineStatusId, setOpenInlineStatusId] = useState<number | null>(
    null,
  );
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [editingTaskId, setEditingTaskId] = useState<number | null>(null);
  const [bulkStatusOpen, setBulkStatusOpen] = useState(false);
  const [bulkAssignOpen, setBulkAssignOpen] = useState(false);
  const [bulkActionLoading, setBulkActionLoading] = useState(false);

  const { isOpen, open, close } = useModal();

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [taskRes, statusRes, memberRes] = await Promise.all([
        callGetTasks(Number(listId)),
        callGetStatuses(),
        callGetSpaceMembers(Number(spaceId)),
      ]);

      const tasks: Task[] = taskRes.data;
      const sts: Status[] = statusRes.data;
      setMembers(memberRes.data.members ?? []);

      const taskMap = new Map<number, Task[]>();
      for (const task of tasks) {
        const sid = task.statusId;
        if (sid) {
          if (!taskMap.has(sid)) taskMap.set(sid, []);
          taskMap.get(sid)!.push(task);
        }
      }

      const sorted = [...sts].sort((a, b) => a.position - b.position);
      setStatuses(sorted);
      setGroups(
        sorted.map((s) => ({ status: s, tasks: taskMap.get(s.id) || [] })),
      );
    } catch {
      toastError("Failed to load tasks.");
    } finally {
      setLoading(false);
    }
  }, [listId, spaceId]);

  useImperativeHandle(ref, () => ({
    refresh: fetchData,
    getTasks: () => groups.flatMap((g) => g.tasks),
  }));

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleUpdate = async (id: number, data: UpdateTask) => {
    try {
      await callUpdateTask(id, data);
      await fetchData();
    } catch {
      toastError("Failed to update task.");
    }
  };

  const handleBulkDelete = async () => {
    if (!deleteId) return;
    try {
      setDeleting(true);
      await Promise.all([...checkedIds].map(callDeleteTask));
      toastSuccess(`${checkedIds.size} tasks deleted successfully!`);
      close();
      setCheckedIds(new Set());
      await fetchData();
    } catch {
      toastError("Failed to delete tasks.");
    } finally {
      setDeleting(false);
    }
  };

  const handleBulkStatus = async (statusId: number) => {
    try {
      setBulkActionLoading(true);
      await Promise.all(
        [...checkedIds].map((id) =>
          callUpdateTask(id, { statusId } as UpdateTask),
        ),
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

  const handleBulkAssign = async (memberIds: number[]) => {
    try {
      setBulkActionLoading(true);
      await Promise.all(
        [...checkedIds].map((id) =>
          callUpdateTask(id, { assignees: memberIds } as UpdateTask),
        ),
      );
      toastSuccess("Assigned successfully.");
      setBulkAssignOpen(false);
      setCheckedIds(new Set());
      await fetchData();
    } catch (error: any) {
      toastError(error.message);
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
    const fromId = Number(source.droppableId);
    const toId = Number(destination.droppableId);

    setGroups((prev) => {
      let moved: Task | undefined;
      const without = prev.map((g) => {
        if (g.status.id !== fromId) return g;
        moved = g.tasks[source.index];
        return { ...g, tasks: g.tasks.filter((_, i) => i !== source.index) };
      });
      if (!moved) return prev;
      return without.map((g) => {
        if (g.status.id !== toId) return g;
        const updated = [...g.tasks];
        updated.splice(destination.index, 0, moved!);
        return { ...g, tasks: updated };
      });
    });

    if (fromId !== toId) handleUpdate(taskId, { statusId: toId } as any);
  };

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
                onClick={() => setSelected(row)}
                className={`flex items-center gap-2.5 cursor-pointer group/row transition-opacity ${snapshot.isDragging ? "opacity-50" : ""}`}
              >
                <span
                  {...provided.dragHandleProps}
                  className="material-symbols-outlined text-[18px] text-stone-200 group-hover/row:text-indigo-300 transition-colors cursor-grab select-none flex-shrink-0"
                >
                  drag_indicator
                </span>
                <input
                  type="checkbox"
                  checked={checkedIds.has(row.id)}
                  onClick={(e) => {
                    e.stopPropagation();
                    setDeleteId(row.id);
                  }}
                  onChange={() =>
                    setCheckedIds((p) => {
                      const n = new Set(p);
                      n.has(row.id) ? n.delete(row.id) : n.add(row.id);
                      return n;
                    })
                  }
                  className="accent-indigo-500 w-4 h-4 rounded-full"
                />
                <span className="text-[13px] font-medium text-stone-700 group-hover/row:text-indigo-600 transition-colors truncate leading-tight">
                  {row.name}
                </span>
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

  const HEADERS = [
    "Task Name",
    "Assignees",
    "Status",
    "Priority",
    "Start Date",
    "Due Date",
    "Tag",
  ];

  return (
    <div className="w-full">
      {loading ? (
        <div className="space-y-8">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse space-y-1.5">
              <div className="h-4 w-28 rounded-md bg-stone-200 mb-3" />
              {[1, 2, 3].map((j) => (
                <div key={j} className="h-11 rounded-xl bg-stone-100/80" />
              ))}
            </div>
          ))}
        </div>
      ) : (
        <DragDropContext onDragEnd={onDragEnd}>
          <div className="space-y-8">
            {groups.map((group) => (
              <Droppable
                droppableId={String(group.status.id)}
                key={group.status.id}
              >
                {(provided) => (
                  <div ref={provided.innerRef} {...provided.droppableProps}>
                    {/* group header */}
                    <div className="flex items-center gap-2.5 mb-2 px-1">
                      <span
                        className="h-2.5 w-2.5 rounded-full flex-shrink-0"
                        style={{ backgroundColor: group.status.color }}
                      />
                      <span className="text-[13px] font-semibold text-stone-600 tracking-wide uppercase">
                        {group.status.name}
                      </span>
                      <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-stone-100 px-1.5 text-[10px] font-bold text-stone-400">
                        {group.tasks.length}
                      </span>
                    </div>

                    {/* table */}
                    <div className="rounded-2xl border border-stone-100 bg-white overflow-visible shadow-sm">
                      {/* header */}
                      <div
                        className="grid items-center border-b border-stone-50 bg-stone-50/80 px-3 py-2 rounded-t-2xl"
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

                      {/* task rows */}
                      <div className="divide-y divide-stone-50">
                        {group.tasks.length === 0 &&
                          openInlineStatusId !== group.status.id && (
                            <div className="py-4 text-center text-xs text-stone-300 font-medium">
                              No tasks yet
                            </div>
                          )}
                        {group.tasks.map((task) =>
                          editingTaskId === task.id ? (
                            <InlineEditRow
                              key={task.id}
                              task={task}
                              statuses={statuses}
                              members={members}
                              onClose={() => setEditingTaskId(null)}
                              onSaved={handleUpdate}
                            />
                          ) : (
                            <div
                              key={task.id}
                              className="grid items-center px-3 py-2.5 hover:bg-stone-50/70 transition-colors group"
                              style={{ gridTemplateColumns: GRID_COLS }}
                            >
                              {makeColumns(group.tasks).map((col) => (
                                <div key={col.key} className="px-1 min-w-0">
                                  {col.render(task)}
                                </div>
                              ))}
                            </div>
                          ),
                        )}
                      </div>

                      {/* inline create row */}
                      {openInlineStatusId === group.status.id && (
                        <InlineCreateRow
                          statusId={group.status.id}
                          statusColor={group.status.color}
                          statusName={group.status.name}
                          members={members}
                          listId={listId}
                          onClose={() => setOpenInlineStatusId(null)}
                          onCreated={() => {
                            setOpenInlineStatusId(null);
                            fetchData();
                          }}
                        />
                      )}

                      {/* add task button */}
                      <button
                        onClick={() => setOpenInlineStatusId(group.status.id)}
                        className="flex w-full items-center gap-2 px-4 py-2.5 text-[12px] font-medium text-stone-400 hover:text-indigo-500 hover:bg-indigo-50/40 transition-colors border-t border-stone-50 rounded-b-2xl"
                      >
                        <span className="material-symbols-outlined text-[16px]">
                          add
                        </span>
                        Add task
                      </button>
                    </div>

                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            ))}

            {groups.length === 0 && (
              <div className="flex flex-col items-center gap-3 py-24 text-stone-300">
                <span className="material-symbols-outlined text-[52px]">
                  checklist
                </span>
                <p className="text-sm font-medium">No tasks yet</p>
              </div>
            )}
          </div>
        </DragDropContext>
      )}

      {/* bulk action bar */}
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
                  const firstId = [...checkedIds][0];
                  if (firstId) setEditingTaskId(firstId);
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

      <ConfirmDeleteModal
        isOpen={isOpen}
        loading={deleting}
        title="Delete Task?"
        description="Are you sure you want to delete this task? This action cannot be undone."
        onClose={() => {
          close();
          setDeleteId(null);
        }}
        onConfirm={handleBulkDelete}
      />

      {/* detail drawer */}
      {selected && (
        <DetailTask
          task={selected}
          statuses={statuses}
          onClose={() => setSelected(null)}
          onUpdate={(data: UpdateTask) => handleUpdate(selected.id, data)}
          onDelete={() => {
            setDeleteId(selected.id);
          }}
        />
      )}
    </div>
  );
});

export default ListView;
