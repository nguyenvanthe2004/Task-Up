import React, { useState, useCallback, useEffect } from "react";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "@hello-pangea/dnd";
import { Member, Task, UpdateTask } from "../../types/task";
import { Status } from "../../types/status";
import { priorityBadge } from "../../constants";
import { callDeleteTask, callUpdateTask } from "../../services/task";
import { callGetCategories } from "../../services/category";
import { callGetStatuses } from "../../services/status";
import { callGetSpaceMembers } from "../../services/space";
import { useParams } from "react-router-dom";
import { toastError, toastSuccess } from "../../lib/toast";
import { AvatarStack } from "../ui/AvatarStack";
import { fmtDate } from "../../lib/until";
import { useModal } from "../../hook/useModal";
import ConfirmDeleteModal from "../ui/ConfirmDeleteModal";

import DetailTask from "../tasks/DetailTask";
import { Category } from "../../types/category";
import { List } from "../../types/list";
import NotFound from "../ui/NotFound";
import { GRID_COLS, InlineCreateRow } from "../tools/InlineCreateRow";
import InlineEditRow from "../tools/InlineEditRow";
import BulkStatusModal from "../tools/BulkStatusModal";
import BulkAssignModal from "../tools/BulkAssignModal";


interface StatusGroup {
  status: Status;
  tasks: Task[];
}

interface ListWithGroups extends List {
  statusGroups: StatusGroup[];
}

interface CategoryWithGroups extends Category {
  lists: ListWithGroups[];
}


const SpaceListView: React.FC = () => {
  const { spaceId } = useParams<{ spaceId: string }>();

  const [categoryGroups, setCategoryGroups] = useState<CategoryWithGroups[]>([]);
  const [statuses, setStatuses] = useState<Status[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [selected, setSelected] = useState<Task | null>(null);
  const [checkedIds, setCheckedIds] = useState<Set<number>>(new Set());
  const [loading, setLoading] = useState(false);
  const [openInlineKey, setOpenInlineKey] = useState<string | null>(null); // "listId-statusId"
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [editingTaskId, setEditingTaskId] = useState<number | null>(null);
  const [bulkStatusOpen, setBulkStatusOpen] = useState(false);
  const [bulkAssignOpen, setBulkAssignOpen] = useState(false);
  const [bulkActionLoading, setBulkActionLoading] = useState(false);
  const [collapsedCategories, setCollapsedCategories] = useState<Set<number>>(new Set());
  const [collapsedLists, setCollapsedLists] = useState<Set<number>>(new Set());

  const { isOpen, open, close } = useModal();


  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [categoryRes, statusRes, memberRes] = await Promise.all([
        callGetCategories(Number(spaceId)),
        callGetStatuses(),
        callGetSpaceMembers(Number(spaceId)),
      ]);

      const sts: Status[] = statusRes.data;
      const sorted = [...sts].sort((a, b) => a.position - b.position);
      setStatuses(sorted);
      setMembers(memberRes.data.members ?? []);

      const built: CategoryWithGroups[] = (categoryRes.data as Category[]).map((cat) => ({
        ...cat,
        lists: (cat.lists ?? []).map((list) => {
          const tasks: Task[] = (list as any).tasks ?? [];

          const taskMap = new Map<number, Task[]>();
          for (const task of tasks) {
            if (task.statusId) {
              if (!taskMap.has(task.statusId)) taskMap.set(task.statusId, []);
              taskMap.get(task.statusId)!.push(task);
            }
          }

          return {
            ...list,
            statusGroups: sorted.map((s) => ({
              status: s,
              tasks: taskMap.get(s.id) || [],
            })),
          } as ListWithGroups;
        }),
      }));

      setCategoryGroups(built);
    } catch {
      toastError("Failed to load categories.");
    } finally {
      setLoading(false);
    }
  }, [spaceId]);

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
    if (checkedIds.size === 0) return;
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
        [...checkedIds].map((id) => callUpdateTask(id, { statusId } as UpdateTask)),
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
    } catch(error: any) {
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
    const [, fromStatusId] = source.droppableId.split("-").map(Number);
    const [, toStatusId] = destination.droppableId.split("-").map(Number);

    setCategoryGroups((prev) =>
      prev.map((cat) => ({
        ...cat,
        lists: cat.lists.map((list) => {
          let moved: Task | undefined;
          const withoutSource = list.statusGroups.map((sg) => {
            if (sg.status.id !== fromStatusId) return sg;
            moved = sg.tasks[source.index];
            return { ...sg, tasks: sg.tasks.filter((_, i) => i !== source.index) };
          });
          if (!moved) return list;
          return {
            ...list,
            statusGroups: withoutSource.map((sg) => {
              if (sg.status.id !== toStatusId) return sg;
              const updated = [...sg.tasks];
              updated.splice(destination.index, 0, moved!);
              return { ...sg, tasks: updated };
            }),
          };
        }),
      }))
    );

    if (fromStatusId !== toStatusId)
      handleUpdate(taskId, { statusId: toStatusId } as any);
  };


  const HEADERS = ["Task Name", "Assignees", "Status", "Priority", "Start Date", "Due Date", "Tag"];

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
            <span className="h-1.5 w-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: s.color }} />
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
          <span className={`text-[12px] font-medium tabular-nums ${overdue ? "text-red-400" : "text-stone-400"}`}>
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


  const renderStatusGroup = (sg: StatusGroup, listId: number) => {
    const droppableId = `${listId}-${sg.status.id}`;

    return (
      <Droppable droppableId={droppableId} key={droppableId}>
        {(provided) => (
          <div ref={provided.innerRef} {...provided.droppableProps} className="mb-4">
            {/* status sub-header */}
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
                  <span key={i} className="text-[10px] font-bold uppercase tracking-widest text-stone-400 px-1">
                    {h}
                  </span>
                ))}
              </div>

              <div className="divide-y divide-stone-50">
                {sg.tasks.length === 0 && openInlineKey !== droppableId && (
                  <div className="py-3 text-center text-xs text-stone-300 font-medium">
                    No tasks yet
                  </div>
                )}
                {sg.tasks.map((task) =>
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
                      {makeColumns(sg.tasks).map((col) => (
                        <div key={col.key} className="px-1 min-w-0">
                          {col.render(task)}
                        </div>
                      ))}
                    </div>
                  )
                )}
              </div>

              {openInlineKey === droppableId && (
                <InlineCreateRow
                  statusId={sg.status.id}
                  statusColor={sg.status.color}
                  statusName={sg.status.name}
                  members={members}
                  listId={String(listId)}
                  onClose={() => setOpenInlineKey(null)}
                  onCreated={() => {
                    setOpenInlineKey(null);
                    fetchData();
                  }}
                />
              )}

              <button
                onClick={() => setOpenInlineKey(droppableId)}
                className="flex w-full items-center gap-2 px-4 py-2 text-[12px] font-medium text-stone-400 hover:text-indigo-500 hover:bg-indigo-50/40 transition-colors border-t border-stone-50 rounded-b-xl"
              >
                <span className="material-symbols-outlined text-[15px]">add</span>
                Add task
              </button>
            </div>

            {provided.placeholder}
          </div>
        )}
      </Droppable>
    );
  };

  const renderList = (list: ListWithGroups) => {
    const isCollapsed = collapsedLists.has(list.id);
    const totalTasks = list.statusGroups.reduce((acc, sg) => acc + sg.tasks.length, 0);

    return (
      <div key={list.id} className="mb-6">
        <button
          onClick={() =>
            setCollapsedLists((prev) => {
              const n = new Set(prev);
              n.has(list.id) ? n.delete(list.id) : n.add(list.id);
              return n;
            })
          }
          className="flex items-center gap-2.5 mb-3 px-1 w-full text-left group/list"
        >
          <span
            className="material-symbols-outlined text-[16px] text-stone-400 transition-transform"
            style={{ transform: isCollapsed ? "rotate(-90deg)" : "rotate(0deg)" }}
          >
            expand_more
          </span>
          <span className="text-[12px] font-semibold text-stone-500 tracking-wide group-hover/list:text-stone-700 transition-colors">
            {list.name}
          </span>
          <span className="flex h-4 min-w-4 items-center justify-center rounded-full bg-stone-100 px-1 text-[9px] font-bold text-stone-400">
            {totalTasks}
          </span>
        </button>

        {!isCollapsed && (
          <div className="pl-4 border-l-2 border-stone-100">
            {list.statusGroups.map((sg) => renderStatusGroup(sg, list.id))}
          </div>
        )}
      </div>
    );
  };

  const renderCategory = (cat: CategoryWithGroups) => {
    const isCollapsed = collapsedCategories.has(cat.id);

    return (
      <div key={cat.id} className="mb-10">
        <button
          onClick={() =>
            setCollapsedCategories((prev) => {
              const n = new Set(prev);
              n.has(cat.id) ? n.delete(cat.id) : n.add(cat.id);
              return n;
            })
          }
          className="flex items-center gap-2 mb-4 w-full text-left group/cat"
        >
          <span
            className="material-symbols-outlined text-[18px] transition-transform"
            style={{
              transform: isCollapsed ? "rotate(-90deg)" : "rotate(0deg)",
            }}
          >
            expand_more
          </span>
          <span
            className="text-[14px] font-bold tracking-wide group-hover/cat:opacity-80 transition-opacity"
          >
            {cat.name}
          </span>
          <span
            className="flex h-5 min-w-5 items-center justify-center rounded-full bg-stone-100 px-1.5 text-[10px] font-bold text-stone-400"
            style={{ backgroundColor: "fff" }}
          >
            {cat.lists.length}
          </span>
        </button>

        {!isCollapsed && (
          <div>
            {cat.lists.length === 0 ? (
              <NotFound />
            ) : (
              cat.lists.map(renderList)
            )}
          </div>
        )}
      </div>
    );
  };


  return (
    <div className="w-full">
      {loading ? (
        <div className="space-y-10">
          {[1, 2].map((i) => (
            <div key={i} className="animate-pulse space-y-3">
              <div className="h-5 w-36 rounded-md bg-stone-200" />
              {[1, 2].map((j) => (
                <div key={j} className="ml-4 space-y-1.5">
                  <div className="h-4 w-24 rounded-md bg-stone-100" />
                  {[1, 2, 3].map((k) => (
                    <div key={k} className="h-10 rounded-xl bg-stone-100/80" />
                  ))}
                </div>
              ))}
            </div>
          ))}
        </div>
      ) : (
        <DragDropContext onDragEnd={onDragEnd}>
          {categoryGroups.length === 0 ? (
            <div className="flex flex-col items-center gap-3 py-24 text-stone-300">
              <span className="material-symbols-outlined text-[52px]">folder</span>
              <p className="text-sm font-medium">No categories yet</p>
            </div>
          ) : (
            categoryGroups.map(renderCategory)
          )}
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
                onClick={() => { setBulkStatusOpen(true); setBulkAssignOpen(false); }}
                className="flex flex-col items-center gap-0.5 rounded-xl p-2 hover:text-indigo-500 hover:bg-indigo-50 transition-colors"
              >
                <span className="material-symbols-outlined text-[18px] text-stone-400">assignment_turned_in</span>
                <span className="text-[9px] font-bold uppercase text-stone-400">Status</span>
              </button>
              <button
                onClick={() => { setBulkAssignOpen(true); setBulkStatusOpen(false); }}
                className="flex flex-col items-center gap-0.5 rounded-xl p-2 hover:text-emerald-500 hover:bg-emerald-50 transition-colors"
              >
                <span className="material-symbols-outlined text-[18px] text-stone-400">person_add</span>
                <span className="text-[9px] font-bold uppercase text-stone-400">Assign</span>
              </button>
              <button
                onClick={() => { const firstId = [...checkedIds][0]; if (firstId) setEditingTaskId(firstId); }}
                className="flex flex-col items-center gap-0.5 rounded-xl p-2 hover:text-violet-500 hover:bg-violet-50 transition-colors"
              >
                <span className="material-symbols-outlined text-[18px] text-stone-400">edit</span>
                <span className="text-[9px] font-bold uppercase text-stone-400">Edit</span>
              </button>
              <button
                onClick={open}
                disabled={deleting}
                className="flex flex-col items-center gap-0.5 rounded-xl p-2 hover:text-red-500 hover:bg-red-50 transition-colors"
              >
                <span className="material-symbols-outlined text-[18px] text-stone-400">delete</span>
                <span className="text-[9px] font-bold uppercase text-stone-400">Delete</span>
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
        onClose={() => { close(); setDeleteId(null); }}
        onConfirm={handleBulkDelete}
      />

      {selected && (
        <DetailTask
          task={selected}
          statuses={statuses}
          onClose={() => setSelected(null)}
          onUpdate={(data: UpdateTask) => handleUpdate(selected.id, data)}
          onDelete={() => { setDeleteId(selected.id); }}
        />
      )}
    </div>
  );
};

export default SpaceListView;