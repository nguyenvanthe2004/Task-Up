import React, { useEffect, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { Task } from "../../types/task";
import DetailTask from "../tasks/DetailTask";
import Categories from "../categories/Categories";
import { Space } from "../../types/space";
import { Activity } from "../../types/activity";
import { Attachment } from "../../types/attachment";
import { toastError } from "../../lib/toast";
import { callGetSpaceById } from "../../services/space";
import { callGetTaskByUser } from "../../services/task";
import { callGetActivities } from "../../services/activity";
import { callGetAttachments } from "../../services/attachment";
import { AvatarStack } from "../ui/AvatarStack";
import SpaceListView from "./SpaceListView";
import SpaceBoardView from "./SpaceBoardView";
import SpaceCalendarView from "./SpaceCalendarView";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { FileText, Inbox } from "lucide-react";
import { Status } from "../../types/status";
import { priorityBadge } from "../../constants";
import { fmtDate } from "../../lib/until";
import StatusManager from "../lists/StattusManager";

type SpaceView = "overview" | "list" | "kanban" | "calendar";

const SpaceOverview: React.FC = () => {
  const { spaceId, workspaceId } = useParams<{
    spaceId: string;
    workspaceId: string;
  }>();
  const [searchParams] = useSearchParams();
  const modeView = searchParams.get("mode");
  const [statuses, setStatuses] = useState<Status[]>([]);
  const [view, setView] = useState<SpaceView>("overview");
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [space, setSpace] = useState<Space | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();
  const user = useSelector(
    (state: RootState) => (state.auth as any).currentUser,
  );

  const onClick = (mode: SpaceView) => {
    navigate(`/${workspaceId}/spaces/${spaceId}?mode=${mode}`);
  };

  useEffect(() => {
    !modeView ? setView("overview") : setView(modeView as SpaceView);
  }, [modeView]);

  useEffect(() => {
    if (!spaceId) return;
    const fetchAll = async () => {
      setLoading(true);
      try {
        const [spaceRes, taskRes, actRes, atmRes] = await Promise.allSettled([
          callGetSpaceById(Number(spaceId)),
          callGetTaskByUser(user?.id),
          callGetActivities(),
          callGetAttachments(),
        ]);

        if (spaceRes.status === "fulfilled") setSpace(spaceRes.value.data);

        if (taskRes.status === "fulfilled") {
          const all: Task[] = taskRes.value.data;
          const filtered = all.filter(
            (t) =>
              String((t as any).list?.category?.space?.id) === String(spaceId),
          );
          setTasks(filtered);
          const uniqueStatuses = Array.from(
            new Map(
              filtered
                .flatMap((t) => (t.status ? [t.status] : []))
                .filter((s: any) => s?.id)
                .map((s: any) => [s.id, s]),
            ).values(),
          ) as Status[];
          setStatuses(uniqueStatuses);
        }

        if (actRes.status === "fulfilled") {
          const all: Activity[] = actRes.value.data;
          const filtered = all.filter(
            (a) =>
              String((a as any).task?.list?.category?.space?.id) ===
              String(spaceId),
          );
          setActivities(filtered);
        }

        if (atmRes.status === "fulfilled") {
          const all: Attachment[] = atmRes.value.data;
          const filtered = all.filter(
            (a) =>
              String((a.task as any)?.list?.category?.space?.id) ===
              String(spaceId),
          );
          setAttachments(filtered);
        }
      } catch (error: any) {
        toastError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, [spaceId, user?.id]);

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(
    (t) => (t.status as any)?.name?.toLowerCase() === "done",
  ).length;
  const completionPct =
    totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const urgentTasks = tasks.filter(
    (t) => t.priority === "urgent" || t.priority === "high",
  ).length;

  const activeTasks = tasks.filter(
    (t) => (t.status as any)?.name?.toLowerCase() !== "done",
  ).length;

  const memberCount = space?.members?.length ?? 0;

  const VIEW_TABS: { key: SpaceView; icon: string; label: string }[] = [
    { key: "overview", icon: "grid_view", label: "Overview" },
    { key: "list", icon: "format_list_bulleted", label: "List" },
    { key: "kanban", icon: "view_kanban", label: "Board" },
    { key: "calendar", icon: "calendar_month", label: "Calendar" },
  ];
  return (
    <main className="ml-64 pt-14 min-h-screen flex flex-col">
      <div className="p-8 max-w-8xl mx-auto w-full">
        {/* ── Header ── */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-5">
          <div>
            <nav className="flex items-center gap-2 mb-2">
              <button
                onClick={() => navigate(`/${workspaceId}/spaces`)}
                className="text-[0.6875rem] font-medium text-on-surface-variant uppercase tracking-widest hover:text-primary transition-colors"
              >
                Spaces
              </button>
              <span className="material-symbols-outlined text-[0.6875rem] text-outline">
                chevron_right
              </span>
              <span className="text-[0.6875rem] font-medium text-on-surface-variant uppercase tracking-widest">
                {space?.name}
              </span>
            </nav>
            <h2 className="text-[1.5rem] font-extrabold text-on-surface tracking-tight">
              {space?.name || "Space Name"}
            </h2>
            <p className="text-on-surface-variant mt-1">
              {space?.description || "No description provided."}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex bg-stone-100 rounded-xl p-1 gap-0.5">
              {VIEW_TABS.map(({ key, icon, label }) => (
                <button
                  key={key}
                  onClick={() => onClick(key)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    view === key
                      ? "bg-white text-indigo-600 shadow-sm"
                      : "text-stone-500 hover:text-stone-700"
                  }`}
                >
                  <span className="material-symbols-outlined text-[16px]">
                    {icon}
                  </span>
                  {label}
                </button>
              ))}
            </div>
            <StatusManager spaceId={Number(spaceId)} />
            <div
              onClick={() => navigate("members")}
              className="flex -space-x-2 pt-4 cursor-pointer"
            >
              <AvatarStack members={space?.members || []} />
            </div>
          </div>
        </div>

        {view === "overview" && (
          <>
            <div className="grid grid-cols-12 gap-6">
              <div className="col-span-12 lg:col-span-8 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-surface-container-lowest p-5 rounded-xl shadow-sm flex flex-col justify-between h-32">
                  <div className="flex justify-between items-start">
                    <span className="text-[0.6875rem] font-bold text-on-surface-variant uppercase tracking-wider">
                      Completion Rate
                    </span>
                    <span className="material-symbols-outlined text-primary text-sm">
                      donut_large
                    </span>
                  </div>
                  <div className="mt-4">
                    <div className="flex items-end justify-between mb-2">
                      <span className="text-2xl font-black text-on-surface">
                        {completionPct}%
                      </span>
                      <span className="text-[0.6875rem] text-primary font-bold">
                        {completedTasks} / {totalTasks}
                      </span>
                    </div>
                    <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                      <div
                        className="bg-primary h-full rounded-full transition-all duration-700"
                        style={{ width: `${completionPct}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Active Tasks */}
                <div className="bg-surface-container-lowest p-5 rounded-xl shadow-sm flex flex-col justify-between h-32">
                  <div className="flex justify-between items-start">
                    <span className="text-[0.6875rem] font-bold text-on-surface-variant uppercase tracking-wider">
                      Active Tasks
                    </span>
                    <span className="material-symbols-outlined text-tertiary text-sm">
                      assignment_turned_in
                    </span>
                  </div>
                  <div className="mt-4">
                    <span className="text-2xl font-black text-on-surface">
                      {activeTasks}
                    </span>
                    <p className="text-[0.6875rem] text-on-surface-variant font-medium mt-1">
                      {urgentTasks > 0
                        ? `${urgentTasks} urgent/high priority`
                        : "No urgent tasks 🎉"}
                    </p>
                  </div>
                </div>

                {/* Members */}
                <div className="bg-surface-container-lowest p-5 rounded-xl shadow-sm flex flex-col justify-between h-32">
                  <div className="flex justify-between items-start">
                    <span className="text-[0.6875rem] font-bold text-on-surface-variant uppercase tracking-wider">
                      Members
                    </span>
                    <span className="material-symbols-outlined text-secondary text-sm">
                      groups
                    </span>
                  </div>
                  <div className="mt-4">
                    <span className="text-2xl font-black text-on-surface">
                      {memberCount}
                    </span>
                    <p className="text-[0.6875rem] text-on-surface-variant font-medium mt-1">
                      {memberCount === 1 ? "member" : "members"} in this space
                    </p>
                  </div>
                </div>
              </div>

              {/* ── Recent Attachments ── */}
              <div className="col-span-12 lg:col-span-4 bg-surface-container-lowest p-6 rounded-xl shadow-sm border border-white/50">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-bold text-on-surface flex items-center gap-2">
                    <span className="material-symbols-outlined text-lg">
                      folder_open
                    </span>
                    Recent Files
                  </h3>
                </div>
                {attachments.length === 0 ? (
                  <p className="text-[0.6875rem] text-on-surface-variant text-center py-6">
                    No files uploaded yet.
                  </p>
                ) : (
                  <ul className="space-y-3">
                    {attachments.slice(0, 4).map((atm) => (
                      <li
                        key={atm.id}
                        className="flex items-center gap-3 p-2 hover:bg-slate-50 rounded-lg transition-colors cursor-pointer group"
                      >
                        <div className="w-8 h-8 bg-blue-50 flex items-center justify-center rounded text-blue-600 flex-shrink-0">
                          <FileText className="w-4 h-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-[0.6875rem] font-bold text-on-surface truncate">
                            {atm.fileName}
                          </p>
                          <p className="text-[0.625rem] text-on-surface-variant uppercase">
                            {atm.task?.name} · {fmtDate(atm.createdAt)}
                          </p>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {/* ── Task List ── */}
              <div className="col-span-12 lg:col-span-8">
                <div className="bg-surface-container-lowest rounded-xl shadow-sm border border-white/50 overflow-hidden">
                  <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                    <h3 className="text-sm font-bold text-on-surface flex items-center gap-2">
                      <span
                        className="material-symbols-outlined text-lg text-primary"
                        style={{ fontVariationSettings: "'FILL' 1" }}
                      >
                        task_alt
                      </span>
                      Tasks
                    </h3>
                    <button
                      onClick={() => onClick("list")}
                      className="text-[0.6875rem] font-bold text-primary hover:underline flex items-center gap-1"
                    >
                      View All
                      <span className="material-symbols-outlined text-[14px]">
                        arrow_forward
                      </span>
                    </button>
                  </div>

                  {(() => {
                    const doneTasks = tasks
                      .filter(
                        (t) =>
                          (t.status as any)?.name?.toLowerCase() === "done",
                      )
                      .slice(0, 5);

                    if (doneTasks.length === 0)
                      return (
                        <div className="p-12 flex flex-col items-center text-center text-on-surface-variant">
                          <span className="material-symbols-outlined text-4xl mb-3 text-slate-200">
                            task_alt
                          </span>
                          <p className="text-sm font-medium">
                            No tasks in this space yet.
                          </p>
                        </div>
                      );

                    return (
                      <>
                        <div
                          className="px-6 py-2 grid items-center bg-slate-50/70 border-b border-slate-100"
                          style={{
                            gridTemplateColumns: "1.5rem 1fr 7rem 6rem 5.5rem",
                          }}
                        >
                          {["", "Task", "List", "Due", "Priority"].map((h) => (
                            <span
                              key={h}
                              className="text-[0.5625rem] font-bold uppercase tracking-widest text-on-surface-variant"
                            >
                              {h}
                            </span>
                          ))}
                        </div>

                        <div className="divide-y divide-slate-50">
                          {doneTasks.map((task) => {
                            const statusColor =
                              (task.status as any)?.color ?? "#6366f1";
                            const priority = task.priority ?? "normal";
                            const isOverdue =
                              task.dueDate &&
                              new Date(task.dueDate) < new Date();

                            return (
                              <div
                                key={task.id}
                                className="px-6 py-3.5 grid items-center hover:bg-slate-50/60 transition-colors group cursor-pointer"
                                style={{
                                  gridTemplateColumns:
                                    "1.5rem 1fr 7rem 6rem 5.5rem",
                                }}
                              >
                                <div
                                  className="w-2.5 h-2.5 rounded-full ring-2 ring-offset-1"
                                  style={{ backgroundColor: statusColor }}
                                />

                                <div className="min-w-0 pr-4">
                                  <p
                                    onClick={() => setSelectedTask(task)}
                                    className="text-[0.8125rem] font-semibold truncate text-on-surface-variant"
                                  >
                                    {task.name}
                                  </p>
                                </div>

                                <span className="text-[0.6875rem] text-on-surface-variant truncate pr-3">
                                  {task.list?.name ?? "—"}
                                </span>

                                <span
                                  className={`inline-flex items-center gap-1 text-[0.6875rem] font-medium ${isOverdue ? "text-red-500" : "text-on-surface-variant"}`}
                                >
                                  <span className="material-symbols-outlined text-[13px]">
                                    {isOverdue ? "event_busy" : "event"}
                                  </span>
                                  {task.dueDate
                                    ? new Date(task.dueDate).toLocaleDateString(
                                        "en-US",
                                        {
                                          month: "short",
                                          day: "numeric",
                                        },
                                      )
                                    : "—"}
                                </span>

                                <span
                                  className={`inline-flex items-center gap-1 text-[0.625rem] font-bold px-2 py-1 rounded-md uppercase tracking-wide ${priorityBadge[priority] ?? priorityBadge.normal}`}
                                >
                                  {priority}
                                </span>
                              </div>
                            );
                          })}
                        </div>

                        {tasks.filter(
                          (t) =>
                            (t.status as any)?.name?.toLowerCase() === "done",
                        ).length > 5 && (
                          <div className="px-6 py-3 border-t border-slate-100 bg-slate-50/50">
                            <button
                              onClick={() => onClick("list")}
                              className="text-[0.6875rem] font-bold text-primary hover:underline"
                            >
                              +
                              {tasks.filter(
                                (t) =>
                                  (t.status as any)?.name?.toLowerCase() ===
                                  "done",
                              ).length - 5}{" "}
                              more → View full list
                            </button>
                          </div>
                        )}
                      </>
                    );
                  })()}
                </div>
              </div>

              {/* ── Recent Activity ── */}
              <div className="col-span-12 lg:col-span-4 bg-surface-container-lowest p-6 rounded-xl shadow-sm border border-white/50 h-fit">
                <h3 className="text-sm font-bold text-on-surface flex items-center gap-2 mb-6">
                  <span className="material-symbols-outlined text-lg">
                    history
                  </span>
                  Recent Activity
                </h3>
                {activities.length === 0 ? (
                  <p className="text-[0.6875rem] text-on-surface-variant text-center py-4">
                    No activity yet.
                  </p>
                ) : (
                  <div className="space-y-6 relative before:content-[''] before:absolute before:left-[11px] before:top-2 before:bottom-0 before:w-px before:bg-slate-100">
                    {activities.slice(0, 5).map((act, i) => (
                      <div key={act.id ?? i} className="relative pl-8">
                        <div className="absolute left-0 top-1 w-[22px] h-[22px] bg-white border-2 border-primary rounded-full flex items-center justify-center z-10">
                          <span className="material-symbols-outlined text-[12px] text-primary">
                            history
                          </span>
                        </div>
                        <p className="text-[0.6875rem] text-on-surface leading-snug">
                          {act.action}
                        </p>
                        <p className="text-[0.625rem] text-on-surface-variant uppercase mt-1">
                          {fmtDate(String(act.createdAt))}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <Categories />
            </div>
          </>
        )}

        {view === "list" && <SpaceListView />}
        {view === "kanban" && <SpaceBoardView />}
        {view === "calendar" && <SpaceCalendarView />}

        {(view === "overview" || view === "list") && selectedTask && (
          <DetailTask
            task={selectedTask}
            statuses={statuses}
            onClose={() => setSelectedTask(null)}
          />
        )}
      </div>
    </main>
  );
};

export default SpaceOverview;
