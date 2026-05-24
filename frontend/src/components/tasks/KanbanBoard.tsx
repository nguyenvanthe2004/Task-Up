import React, {
  useState,
  useCallback,
  useEffect,
  forwardRef,
  useImperativeHandle,
  useRef,
} from "react";
import { useParams } from "react-router-dom";
import { ListViewHandle, Member, Task, UpdateTask } from "../../types/task";
import { Status } from "../../types/status";
import DetailTask from "./DetailTask";
import {
  callDeleteTask,
  callGetTasks,
  callUpdateTask,
} from "../../services/task";
import { callGetStatuses } from "../../services/status";
import { callGetSpaceMembers } from "../../services/space";
import { toastError, toastSuccess } from "../../lib/toast";
import { useModal } from "../../hook/useModal";
import ConfirmDeleteModal from "../ui/ConfirmDeleteModal";
import TaskCard from "./TaskCard";
import BulkStatusModal from "../tools/BulkStatusModal";
import BulkAssignModal from "../tools/BulkAssignModal";
import { InlineCreateCard } from "../tools/InlineCreateCard";
import { InlineEditCard } from "../tools/InlineEditCard";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { BASE_URL } from "../../constants";
import { io } from "socket.io-client";

const isTaskPublic = (task: Task): boolean => Boolean(task.isPublic);

const canViewTask = (task: Task, userId: number): boolean => {
  if (isTaskPublic(task)) return true;

  const ownerId = task.list?.category?.space?.workspace?.ownerId;
  if (ownerId !== undefined && ownerId === userId) return true;

  if (task.assignees?.some((a) => a.id === userId)) return true;

  return false;
};

const KanbanBoard = forwardRef<ListViewHandle>((_, ref) => {
  const { listId, spaceId } = useParams<{ listId: string; spaceId: string }>();
  const user = useSelector((state: RootState) => state.auth.currentUser);

  const [groups, setGroups] = useState<{ status: Status; tasks: Task[] }[]>([]);
  const [statuses, setStatuses] = useState<Status[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(false);

  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [checkedIds, setCheckedIds] = useState<Set<number>>(new Set());
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [editingTaskId, setEditingTaskId] = useState<number | null>(null);
  const [openInlineStatusId, setOpenInlineStatusId] = useState<number | null>(
    null,
  );

  const [bulkStatusOpen, setBulkStatusOpen] = useState(false);
  const [bulkAssignOpen, setBulkAssignOpen] = useState(false);
  const [bulkActionLoading, setBulkActionLoading] = useState(false);
  const membersRef = useRef<Member[]>([]);

  const [dragging, setDragging] = useState<{
    taskId: number;
    fromStatusId: number;
  } | null>(null);
  const [dragOver, setDragOver] = useState<number | null>(null);

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
        sorted.map((s) => ({ status: s, tasks: taskMap.get(s.id) ?? [] })),
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

  useEffect(() => {
    membersRef.current = members;
  }, [members]);

  useEffect(() => {
    if (!user) {
      return;
    }
    const socket = io(BASE_URL.replace("/api", ""), {
      withCredentials: true,
    });
    socket.on("connect", () => {
      socket.emit("join", { userId: user.id });
    });

    socket.on("task:created", async (data: { taskId: number }) => {
      try {
        const res = await callGetTasks(Number(listId));
        const newTask = (res.data as Task[]).find((t) => t.id === data.taskId);
        if (!newTask) return;
        setGroups((prev) =>
          prev.map((g) =>
            g.status.id === newTask.statusId
              ? { ...g, tasks: [...g.tasks, newTask] }
              : g,
          ),
        );
      } catch {}
    });

    socket.on("task:updated", (data: { task: Task }) => {
      setGroups((prev) => {
        let moved: Task | undefined;
        const without = prev.map((g) => {
          const found = g.tasks.find((t) => t.id === data.task.id);
          if (!found) return g;
          moved = {
            ...found,
            ...data.task,
            assignees: data.task.assignees ?? found.assignees, // giữ assignees cũ nếu không có
          };
          return { ...g, tasks: g.tasks.filter((t) => t.id !== data.task.id) };
        });
        if (!moved) return prev;
        return without.map((g) =>
          g.status.id === moved!.statusId
            ? { ...g, tasks: [...g.tasks, moved!] }
            : g,
        );
      });
      setSelectedTask((prev) =>
        prev?.id === data.task.id
          ? {
              ...prev,
              ...data.task,
              assignees: data.task.assignees ?? prev.assignees,
            }
          : prev,
      );
    });

    socket.on("task:deleted", (data: { taskId: number; taskName: string }) => {
      console.log("task:deleted:", JSON.stringify(data, null, 2));
      setGroups((prev) =>
        prev.map((g) => ({
          ...g,
          tasks: g.tasks.filter((t) => t.id !== data.taskId),
        })),
      );
      setSelectedTask((prev) => (prev?.id === data.taskId ? null : prev));
    });

    socket.on(
      "task:assignee:changed",
      (data: {
        taskId: number;
        addedAssignees: number[];
        removedAssignees: number[];
      }) => {
        const currentMembers = membersRef.current;
        setGroups((prev) =>
          prev.map((g) => ({
            ...g,
            tasks: g.tasks.map((t) => {
              if (t.id !== data.taskId) return t;
              const currentAssignees = t.assignees ?? [];
              const afterRemove = currentAssignees.filter(
                (a) => !data.removedAssignees.includes(a.id),
              );
              const toAdd = currentMembers.filter((m: Member) =>
                data.addedAssignees.includes(m.id),
              );
              const newAssignees = [
                ...afterRemove,
                ...toAdd.filter(
                  (m: Member) => !afterRemove.some((a) => a.id === m.id),
                ),
              ];
              return { ...t, assignees: newAssignees };
            }),
          })),
        );
        setSelectedTask((prev) => {
          if (prev?.id !== data.taskId) return prev;
          const currentAssignees = prev.assignees ?? [];
          const afterRemove = currentAssignees.filter(
            (a) => !data.removedAssignees.includes(a.id),
          );
          const toAdd = currentMembers.filter((m: Member) =>
            data.addedAssignees.includes(m.id),
          );
          const newAssignees = [
            ...afterRemove,
            ...toAdd.filter(
              (m: Member) => !afterRemove.some((a) => a.id === m.id),
            ),
          ];
          return { ...prev, assignees: newAssignees };
        });
      },
    );

    return () => {
      socket.emit("leave", { userId: user.id });
      socket.disconnect();
    };
  }, [user?.id, fetchData]);

  const handleTaskClick = (task: Task) => {
    if (!user) return;
    if (!canViewTask(task, user.id)) return;
    setSelectedTask(task);
  };

  const handleUpdate = async (id: number, data: UpdateTask) => {
    try {
      await callUpdateTask(id, data);
      setGroups((prev) =>
        prev.map((g) => ({
          ...g,
          tasks: g.tasks.map((t) => {
            if (t.id !== id) return t;
            const updatedAssignees = data.assignees
              ? members.filter((m) =>
                  (data.assignees as number[]).includes(m.id),
                )
              : t.assignees;

            return { ...t, ...data, assignees: updatedAssignees };
          }),
        })),
      );
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
    } catch {
      toastError("Failed to assign.");
    } finally {
      setBulkActionLoading(false);
    }
  };

  const handleDrop = (toStatusId: number) => {
    if (!dragging) return;
    const { taskId, fromStatusId } = dragging;
    if (fromStatusId === toStatusId) {
      setDragging(null);
      setDragOver(null);
      return;
    }

    setGroups((prev) => {
      let moved: Task | undefined;
      const without = prev.map((g) => {
        if (g.status.id !== fromStatusId) return g;
        moved = g.tasks.find((t) => t.id === taskId);
        return { ...g, tasks: g.tasks.filter((t) => t.id !== taskId) };
      });
      if (!moved) return prev;
      return without.map((g) =>
        g.status.id === toStatusId ? { ...g, tasks: [moved!, ...g.tasks] } : g,
      );
    });

    handleUpdate(taskId, { statusId: toStatusId } as UpdateTask);
    setDragging(null);
    setDragOver(null);
  };

  const toggleCheck = (id: number) => {
    setCheckedIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  if (loading) {
    return (
      <div className="w-full mt-6 flex gap-3 overflow-x-auto pb-4">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="flex-none w-64 rounded-2xl border border-stone-200/60 bg-white/60 animate-pulse"
          >
            <div className="px-3 pt-3 pb-2.5 flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-stone-200" />
              <div className="h-3 w-20 rounded bg-stone-200" />
            </div>
            <div className="px-2.5 pb-3 space-y-2">
              {[1, 2].map((j) => (
                <div key={j} className="h-24 rounded-xl bg-stone-100" />
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="w-full mt-6">
      {/* ── Board ── */}
      <div
        className="flex items-start gap-3 pb-4"
        style={{
          overflowX: "auto",
          scrollbarWidth: "thin",
          scrollbarColor: "#e7e5e4 transparent",
        }}
      >
        {groups.map((group) => {
          const isDone =
            group.status.name.toLowerCase() === "done" ||
            group.status.name.toLowerCase() === "closed";
          return (
            <section
              key={group.status.id}
              className={`
                flex-none flex flex-col
                w-[280px] sm:w-[320px] lg:w-[360px]
                rounded-2xl border transition-all duration-150
                ${
                  dragOver === group.status.id
                    ? "border-indigo-300 bg-indigo-50/50 shadow-lg"
                    : "border-stone-200/60 bg-white/60"
                }
              `}
              onDragOver={(e) => {
                e.preventDefault();
                setDragOver(group.status.id);
              }}
              onDragLeave={() => setDragOver(null)}
              onDrop={() => handleDrop(group.status.id)}
            >
              {/* Column header */}
              <div className="flex items-center justify-between px-3 pt-3 pb-2.5">
                <div className="flex items-center gap-2 min-w-0">
                  <span
                    className="w-2.5 h-2.5 rounded-full flex-none"
                    style={{ backgroundColor: group.status.color }}
                  />
                  <span className="text-xs font-bold text-stone-600 uppercase tracking-widest truncate">
                    {group.status.name}
                  </span>
                  <span className="text-[10px] font-bold text-stone-400 bg-stone-100 rounded-full px-1.5 py-0.5 flex-none">
                    {group.tasks.length}
                  </span>
                </div>
                <button
                  onClick={() => {
                    setOpenInlineStatusId(group.status.id);
                    setEditingTaskId(null);
                  }}
                  className="p-1 rounded-lg text-stone-300 hover:text-indigo-500 hover:bg-indigo-50 transition-colors flex-none ml-1"
                  title="Add task"
                >
                  <svg
                    className="w-3.5 h-3.5"
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
              </div>

              {/* Cards */}
              <div
                className="flex-1 px-2.5 pb-0 space-y-2 overflow-y-auto"
                style={{
                  maxHeight: "calc(100vh - 64px - 130px - 48px - 44px - 24px)",
                  scrollbarWidth: "thin",
                  scrollbarColor: "#e7e5e4 transparent",
                }}
              >
                {openInlineStatusId === group.status.id && (
                  <InlineCreateCard
                    statusId={group.status.id}
                    listId={listId}
                    members={members}
                    statuses={statuses}
                    onClose={() => setOpenInlineStatusId(null)}
                    onCreated={() => {
                      setOpenInlineStatusId(null);
                      fetchData();
                    }}
                  />
                )}

                {group.tasks.map((task) =>
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
                        setDragging({
                          taskId: task.id,
                          fromStatusId: group.status.id,
                        })
                      }
                      onDragEnd={() => {
                        setDragging(null);
                        setDragOver(null);
                      }}
                      className={`relative ${dragging?.taskId === task.id ? "opacity-40" : ""}`}
                    >
                      <TaskCard
                        task={task}
                        isDone={isDone}
                        isChecked={checkedIds.has(task.id)}
                        statuses={statuses}
                        members={members}
                        onSelect={handleTaskClick}
                        onDelete={(id) => {
                          setDeleteId(id);
                          setCheckedIds(new Set([id]));
                          open();
                        }}
                        onEdit={(id) => setEditingTaskId(id)}
                        onCheck={toggleCheck}
                      />
                      {!isTaskPublic(task) && (
                        <span
                          title={
                            user && canViewTask(task, user.id)
                              ? "Private task (you have access)"
                              : "Private task — you don't have access"
                          }
                          className={`material-symbols-outlined absolute top-2 right-2 text-[13px] select-none pointer-events-none ${
                            user && canViewTask(task, user.id)
                              ? "text-stone-300"
                              : "text-amber-400"
                          }`}
                        >
                          lock
                        </span>
                      )}
                    </div>
                  ),
                )}

                {group.tasks.length === 0 &&
                  openInlineStatusId !== group.status.id && (
                    <div className="flex flex-col items-center justify-center py-8 text-stone-300">
                      <svg
                        className="w-6 h-6 mb-1.5"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={1.5}
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                        />
                      </svg>
                      <p className="text-xs font-medium">No tasks</p>
                    </div>
                  )}
              </div>

              {/* Add task footer */}
              <div className="px-2.5 py-2.5">
                <button
                  onClick={() => {
                    setOpenInlineStatusId(group.status.id);
                    setEditingTaskId(null);
                  }}
                  className="w-full flex items-center justify-center gap-1.5 py-2 border border-dashed border-stone-200 rounded-xl text-stone-400 hover:text-indigo-500 hover:border-indigo-300 hover:bg-indigo-50/50 transition-all text-xs font-semibold"
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
                  Add task
                </button>
              </div>
            </section>
          );
        })}

        <button className="flex-none self-start flex items-center gap-2 px-4 py-2.5 border-2 border-dashed border-stone-200 rounded-2xl text-stone-400 hover:bg-white hover:text-indigo-500 hover:border-indigo-200 transition-all text-xs font-bold tracking-wide whitespace-nowrap">
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
              d="M12 4v16m8-8H4"
            />
          </svg>
          Add Column
        </button>
      </div>

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
              {checkedIds.size === 1 && (
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
              )}
              {checkedIds.size === 1 && (
                <button
                  onClick={() => {
                    const firstId = [...checkedIds][0];
                    if (firstId) {
                      setEditingTaskId(firstId);
                      setCheckedIds(new Set());
                    }
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
              )}
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
        description={`Are you sure you want to delete ${checkedIds.size > 1 ? `${checkedIds.size} tasks` : "this task"}? This action cannot be undone.`}
        onClose={() => {
          close();
          setDeleteId(null);
        }}
        onConfirm={handleBulkDelete}
      />

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
});

export default KanbanBoard;
