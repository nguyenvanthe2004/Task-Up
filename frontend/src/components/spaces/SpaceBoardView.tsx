import React, { useState, useCallback, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Member, Task, UpdateTask } from "../../types/task";
import { Status } from "../../types/status";
import { Category } from "../../types/category";
import { List } from "../../types/list";
import DetailTask from "../tasks/DetailTask";
import { callDeleteTask, callUpdateTask } from "../../services/task";
import { callGetCategories } from "../../services/category";
import { callGetStatuses } from "../../services/status";
import { callGetSpaceMembers } from "../../services/space";
import { toastError, toastSuccess } from "../../lib/toast";
import { useModal } from "../../hook/useModal";
import ConfirmDeleteModal from "../ui/ConfirmDeleteModal";
import TaskCard from "../tasks/TaskCard";
import { InlineCreateCard } from "../tools/InlineCreateCard";
import { InlineEditCard } from "../tools/InlineEditCard";
import NotFound from "../ui/NotFound";
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

const SpaceBoardView: React.FC = () => {
  const { spaceId } = useParams<{ spaceId: string }>();

  const [categoryGroups, setCategoryGroups] = useState<CategoryWithGroups[]>([]);
  const [statuses, setStatuses] = useState<Status[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(false);

  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [checkedIds, setCheckedIds] = useState<Set<number>>(new Set());
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [editingTaskId, setEditingTaskId] = useState<number | null>(null);

  const [openInlineKey, setOpenInlineKey] = useState<string | null>(null);

  const [bulkStatusOpen, setBulkStatusOpen] = useState(false);
  const [bulkAssignOpen, setBulkAssignOpen] = useState(false);
  const [bulkActionLoading, setBulkActionLoading] = useState(false);

  const [collapsedCategories, setCollapsedCategories] = useState<Set<number>>(new Set());
  const [collapsedLists, setCollapsedLists] = useState<Set<number>>(new Set());

  const [dragging, setDragging] = useState<{ taskId: number; fromStatusId: number } | null>(null);
  const [dragOver, setDragOver] = useState<string | null>(null); 

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
              tasks: taskMap.get(s.id) ?? [],
            })),
          } as ListWithGroups;
        }),
      }));

      setCategoryGroups(built);
    } catch {
      toastError("Failed to load.");
    } finally {
      setLoading(false);
    }
  }, [spaceId]);

  useEffect(() => { fetchData(); }, [fetchData]);

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
      toastSuccess(`${checkedIds.size} tasks deleted!`);
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
        [...checkedIds].map((id) => callUpdateTask(id, { statusId } as UpdateTask))
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
          callUpdateTask(id, { assignees: memberIds } as UpdateTask)
        )
      );
      toastSuccess("Assigned successfully.");
      setBulkAssignOpen(false);
      setCheckedIds(new Set());
      await fetchData();
    } catch {
      toastError("Failed to assign.");
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

  const handleDrop = (listId: number, toStatusId: number) => {
    if (!dragging) return;
    const { taskId, fromStatusId } = dragging;

    if (fromStatusId === toStatusId) {
      setDragging(null);
      setDragOver(null);
      return;
    }

    setCategoryGroups((prev) =>
      prev.map((cat) => ({
        ...cat,
        lists: cat.lists.map((list) => {
          let moved: Task | undefined;
          const without = list.statusGroups.map((sg) => {
            if (sg.status.id !== fromStatusId) return sg;
            moved = sg.tasks.find((t) => t.id === taskId);
            return { ...sg, tasks: sg.tasks.filter((t) => t.id !== taskId) };
          });
          if (!moved) return list;
          return {
            ...list,
            statusGroups: without.map((sg) =>
              sg.status.id === toStatusId
                ? { ...sg, tasks: [moved!, ...sg.tasks] }
                : sg
            ),
          };
        }),
      }))
    );

    handleUpdate(taskId, { statusId: toStatusId } as UpdateTask);
    setDragging(null);
    setDragOver(null);
  };

  const toggleCategory = (id: number) =>
    setCollapsedCategories((prev) => {
      const n = new Set(prev);
      n.has(id) ? n.delete(id) : n.add(id);
      return n;
    });

  const toggleList = (id: number) =>
    setCollapsedLists((prev) => {
      const n = new Set(prev);
      n.has(id) ? n.delete(id) : n.add(id);
      return n;
    });

  const renderBoard = (list: ListWithGroups) => {
    const isDone = (s: Status) =>
      s.name.toLowerCase() === "done" || s.name.toLowerCase() === "closed";

    return (
      <div
        className="flex items-start gap-3 pb-2"
        style={{ overflowX: "auto", scrollbarWidth: "thin", scrollbarColor: "#e7e5e4 transparent" }}
      >
        {list.statusGroups.map((sg) => {
          const colKey = `${list.id}-${sg.status.id}`;
          const isOver = dragOver === colKey;

          return (
            <section
              key={sg.status.id}
              className={`
                flex-none flex flex-col
                w-[220px] sm:w-[240px] lg:w-56 xl:w-60
                rounded-2xl border transition-all duration-150
                ${isOver
                  ? "border-indigo-300 bg-indigo-50/50 shadow-lg"
                  : "border-stone-200/60 bg-white/60"
                }
              `}
              onDragOver={(e) => { e.preventDefault(); setDragOver(colKey); }}
              onDragLeave={() => setDragOver(null)}
              onDrop={() => handleDrop(list.id, sg.status.id)}
            >
              {/* Column header */}
              <div className="flex items-center justify-between px-3 pt-3 pb-2.5">
                <div className="flex items-center gap-2 min-w-0">
                  <span
                    className="w-2 h-2 rounded-full flex-none"
                    style={{ backgroundColor: sg.status.color }}
                  />
                  <span className="text-[11px] font-bold text-stone-600 uppercase tracking-widest truncate">
                    {sg.status.name}
                  </span>
                  <span className="text-[10px] font-bold text-stone-400 bg-stone-100 rounded-full px-1.5 py-0.5 flex-none">
                    {sg.tasks.length}
                  </span>
                </div>
                <button
                  onClick={() => {
                    setOpenInlineKey(colKey);
                    setEditingTaskId(null);
                  }}
                  className="p-1 rounded-lg text-stone-300 hover:text-indigo-500 hover:bg-indigo-50 transition-colors flex-none"
                  title="Add task"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                  </svg>
                </button>
              </div>

              {/* Cards */}
              <div
                className="flex-1 px-2.5 space-y-2 overflow-y-auto"
                style={{
                  maxHeight: "calc(100vh - 64px - 200px)",
                  scrollbarWidth: "thin",
                  scrollbarColor: "#e7e5e4 transparent",
                }}
              >
                {/* Inline create */}
                {openInlineKey === colKey && (
                  <InlineCreateCard
                    statusId={sg.status.id}
                    listId={String(list.id)}
                    members={members}
                    statuses={statuses}
                    onClose={() => setOpenInlineKey(null)}
                    onCreated={() => {
                      setOpenInlineKey(null);
                      fetchData();
                    }}
                  />
                )}

                {sg.tasks.map((task) =>
                  editingTaskId === task.id ? (
                    <InlineEditCard
                      key={task.id}
                      task={task}
                      members={members}
                      statuses={statuses}
                      onClose={() => setEditingTaskId(null)}
                      onSaved={handleUpdate}
                    />
                  ) : (
                    <div
                      key={task.id}
                      draggable
                      onDragStart={() =>
                        setDragging({ taskId: task.id, fromStatusId: sg.status.id })
                      }
                      onDragEnd={() => { setDragging(null); setDragOver(null); }}
                      className={dragging?.taskId === task.id ? "opacity-40" : ""}
                    >
                      <TaskCard
                        task={task}
                        isDone={isDone(sg.status)}
                        isChecked={checkedIds.has(task.id)}
                        statuses={statuses}
                        members={members}
                        onSelect={setSelectedTask}
                        onDelete={(id) => {
                          setDeleteId(id);
                          setCheckedIds(new Set([id]));
                          open();
                        }}
                        onEdit={(id) => setEditingTaskId(id)}
                        onCheck={toggleCheck}
                      />
                    </div>
                  )
                )}

                {sg.tasks.length === 0 && openInlineKey !== colKey && (
                  <div className="flex flex-col items-center justify-center py-6 text-stone-300">
                    <svg className="w-5 h-5 mb-1" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                    <p className="text-[11px] font-medium">No tasks</p>
                  </div>
                )}
              </div>

              {/* Add task footer */}
              <div className="px-2.5 py-2.5">
                <button
                  onClick={() => {
                    setOpenInlineKey(colKey);
                    setEditingTaskId(null);
                  }}
                  className="w-full flex items-center justify-center gap-1.5 py-2 border border-dashed border-stone-200 rounded-xl text-stone-400 hover:text-indigo-500 hover:border-indigo-300 hover:bg-indigo-50/50 transition-all text-[11px] font-semibold"
                >
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                  </svg>
                  Add task
                </button>
              </div>
            </section>
          );
        })}
      </div>
    );
  };

  const renderList = (list: ListWithGroups) => {
    const isCollapsed = collapsedLists.has(list.id);
    const totalTasks = list.statusGroups.reduce((acc, sg) => acc + sg.tasks.length, 0);

    return (
      <div key={list.id} className="mb-6">
        {/* List header */}
        <button
          onClick={() => toggleList(list.id)}
          className="flex items-center gap-2.5 mb-3 px-1 w-full text-left group/list"
        >
          <span
            className="material-symbols-outlined text-[16px] text-stone-400 transition-transform duration-200"
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
            {renderBoard(list)}
          </div>
        )}
      </div>
    );
  };

  const renderCategory = (cat: CategoryWithGroups) => {
    const isCollapsed = collapsedCategories.has(cat.id);
    const totalLists = cat.lists.length;

    return (
      <div key={cat.id} className="mb-10">
        {/* Category header */}
        <button
          onClick={() => toggleCategory(cat.id)}
          className="flex items-center gap-2 mb-5 w-full text-left group/cat"
        >
          <span
            className="material-symbols-outlined text-[18px] text-stone-500 transition-transform duration-200"
            style={{ transform: isCollapsed ? "rotate(-90deg)" : "rotate(0deg)" }}
          >
            expand_more
          </span>
          <span className="text-[14px] font-bold text-stone-700 tracking-wide group-hover/cat:text-stone-900 transition-colors">
            {cat.name}
          </span>
          <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-stone-100 px-1.5 text-[10px] font-bold text-stone-400">
            {totalLists}
          </span>

          {/* Divider line */}
          <div className="flex-1 h-px bg-stone-100 ml-2" />
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

  if (loading) {
    return (
      <div className="w-full space-y-10">
        {[1, 2].map((i) => (
          <div key={i} className="animate-pulse space-y-4">
            <div className="h-5 w-36 rounded-md bg-stone-200" />
            {[1, 2].map((j) => (
              <div key={j} className="ml-4 space-y-2">
                <div className="h-4 w-24 rounded-md bg-stone-100" />
                <div className="flex gap-3">
                  {[1, 2, 3, 4].map((k) => (
                    <div key={k} className="flex-none w-56 rounded-2xl border border-stone-200/60 bg-white/60">
                      <div className="px-3 pt-3 pb-2.5 flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-stone-200" />
                        <div className="h-3 w-16 rounded bg-stone-200" />
                      </div>
                      <div className="px-2.5 pb-3 space-y-2">
                        {[1, 2].map((l) => (
                          <div key={l} className="h-20 rounded-xl bg-stone-100" />
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="w-full">
      {categoryGroups.length === 0 ? (
        <div className="flex flex-col items-center gap-3 py-24 text-stone-300">
          <span className="material-symbols-outlined text-[52px]">folder</span>
          <p className="text-sm font-medium">No categories yet</p>
        </div>
      ) : (
        categoryGroups.map(renderCategory)
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
                onClick={() => {
                  const firstId = [...checkedIds][0];
                  if (firstId) setEditingTaskId(firstId);
                }}
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
                className="flex flex-col items-center gap-0.5 rounded-xl p-2 hover:text-stone-600 hover:bg-stone-100 transition-colors"
              >
                <span className="material-symbols-outlined text-[18px] text-stone-400">close</span>
                <span className="text-[9px] font-bold uppercase text-stone-400">Clear</span>
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
        description={`Are you sure you want to delete ${checkedIds.size > 1 ? `${checkedIds.size} tasks` : "this task"}? This action cannot be undone.`}
        onClose={() => { close(); setDeleteId(null); }}
        onConfirm={handleBulkDelete}
      />

      {/* ── Detail drawer ── */}
      {selectedTask && (
        <DetailTask
          task={selectedTask}
          statuses={statuses}
          onClose={() => setSelectedTask(null)}
          onUpdate={(data: UpdateTask) => handleUpdate(selectedTask.id, data)}
          onDelete={() => {
            setDeleteId(selectedTask.id);
            setCheckedIds(new Set([selectedTask.id]));
            setSelectedTask(null);
            open();
          }}
        />
      )}
    </div>
  );
};

export default SpaceBoardView;