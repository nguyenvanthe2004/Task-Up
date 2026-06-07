import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { callGetActivities } from "../../services/activity";
import { callGetSpaces } from "../../services/space";
import { callGetTaskByUser, callGetTaskSummary } from "../../services/task";
import { callGetMyWorkspace } from "../../services/workspace";
import { Activity } from "../../types/activity";
import { Space } from "../../types/space";
import { Task, TaskSummary } from "../../types/task";
import { Workspace } from "../../types/workspace";
import LoadingPage from "../ui/LoadingPage";
import CreateWorkspaceModal from "../workspaces/CreateWorkspaceModal";
import QuickAccess from "./QuickAccess";
import StatsPanel from "./Statspanel";
import { Attachment } from "../../types/attachment";
import { isToday } from "../../lib/until";
import { callGetAttachments } from "../../services/attachment";
import { FileText } from "lucide-react";
import { callGetLatestNotifications } from "../../services/notifications";
import NotificationList from "./NotificationList";
import SpaceProgress from "./SpaceProgress";
import { Notification } from "../../types/notification";

const Home: React.FC = () => {
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [spaces, setSpaces] = useState<Space[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [summary, setSummary] = useState<TaskSummary | null>(null);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingWorkspaces, setLoadingWorkspaces] = useState(true);
  const [openCreate, setOpenCreate] = useState(true);
  const navigate = useNavigate();
  const { workspaceId } = useParams();
  const user = useSelector((state: any) => state.auth.currentUser);

  useEffect(() => {
    const fetchWorkspaces = async () => {
      try {
        const wsRes = await callGetMyWorkspace();
        setWorkspaces(wsRes.data ?? []);
      } catch (error: any) {

      } finally {
        setLoadingWorkspaces(false);
      }
    };

    fetchWorkspaces();
  }, []);

  useEffect(() => {
    if (!user?.id || !workspaceId || workspaces.length === 0) return;

    const fetchWorkspaceData = async () => {
      try {
        const [taskRes, summaryRes, actRes, atmRes, spaceRes, notiRes] =
          await Promise.allSettled([
            callGetTaskByUser(user.id),
            callGetTaskSummary(),
            callGetActivities(),
            callGetAttachments(),
            callGetSpaces(Number(workspaceId)),
            callGetLatestNotifications(Number(workspaceId)),
          ]);

        const allSpaces: Space[] =
          spaceRes.status === "fulfilled" ? spaceRes.value.data : [];

        const userSpaces = allSpaces.filter((sp: any) => {
          if (Array.isArray(sp.members)) {
            return sp.members.some((m: any) => (m.userId ?? m.id) === user.id);
          }
          return true;
        });

        const spaceIds = new Set(userSpaces.map((sp) => sp.id));
        setSpaces(userSpaces);

        const allTasks: Task[] =
          taskRes.status === "fulfilled" ? taskRes.value.data : [];

        const userTasks =
          spaceIds.size > 0
            ? allTasks.filter((t) => {
                const spaceId = (t as any).list?.category?.space?.id;
                return spaceId !== undefined && spaceIds.has(spaceId);
              })
            : [];
        setTasks(userTasks);

        if (summaryRes.status === "fulfilled") {
          const raw = summaryRes.value.data as TaskSummary;

          const DONE_KEYWORDS = [
            "done",
            "complete",
            "completed",
            "closed",
            "finish",
            "finished",
          ];
          const isDone = (t: Task) => {
            const name = (t.status as any)?.name?.toLowerCase() ?? "";
            return DONE_KEYWORDS.some((kw) => name.includes(kw));
          };

          const completed = userTasks.filter(isDone).length;
          const total = userTasks.length;
          const highPriority = userTasks.filter(
            (t) => t.priority === "high" || t.priority === "urgent",
          ).length;
          const upcoming = userTasks.filter((t) => {
            if (!t.dueDate) return false;
            const diff = new Date(t.dueDate).getTime() - Date.now();
            return diff > 0 && diff <= 48 * 60 * 60 * 1000;
          }).length;
          const dueToday = userTasks.filter((t) => isToday(t.dueDate)).length;

          setSummary({
            ...raw,
            completed,
            total,
            highPriority,
            upcoming,
            dueToday,
          });
        } else {
          setSummary(null);
        }

        if (actRes.status === "fulfilled") {
          const allAc: Activity[] = actRes.value.data;
          const userActivities = allAc.filter((a) => {
            const isOwner =
              (a as any).userId === user.id || (a as any).user?.id === user.id;
            const wsId = a.task?.list?.category?.space?.workspace?.id;
            const inWorkspace = String(wsId) === String(workspaceId);
            return isOwner && inWorkspace;
          });
          setActivities(userActivities);
        } else {
          setActivities([]);
        }

        if (atmRes.status === "fulfilled") {
          const allAtm: Attachment[] = atmRes.value.data;
          const userAttachments = allAtm.filter((a) => {
            const isUploader =
              (a as any).uploadedBy === user.id ||
              (a as any).uploader?.id === user.id;
            const wsId = (a as any).task?.list?.category?.space?.workspace?.id;
            const inWorkspace = String(wsId) === String(workspaceId);
            return isUploader && inWorkspace;
          });
          setAttachments(userAttachments);
        } else {
          setAttachments([]);
        }

        if (notiRes.status === "fulfilled") {
          setNotifications(notiRes.value.data ?? []);
        } else {
          setNotifications([]);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchWorkspaceData();
  }, [workspaceId, workspaces.length, user?.id]);

  if (!loadingWorkspaces && workspaces.length === 0) {
    return (
      <CreateWorkspaceModal
        isOpen={openCreate}
        onClose={() => {
          if (workspaces.length === 0) return;
          setOpenCreate(false);
        }}
        onSuccess={(newWorkspace) => {
          setWorkspaces([newWorkspace]);
          navigate(`/${newWorkspace.id}`);
        }}
      />
    );
  }

  if (loading) return <LoadingPage />;

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      <div className="lg:pl-64 pt-10 min-h-screen">
        <div className="p-5 sm:p-6 lg:p-8 max-w-8xl">
          {/* Header */}
          <section className="mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-5">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 mb-1.5">
                Welcome back, {user.fullName?.split(" ").pop()} 👋
              </h1>
              <p className="text-slate-500 text-sm">
                You have{" "}
                <span className="text-indigo-600 font-semibold">
                  {summary?.highPriority ?? 0} high-priority tasks
                </span>{" "}
                assigned to you.
              </p>
            </div>
            <div className="flex gap-3 sm:gap-4">
              <div className="bg-white px-4 sm:px-5 py-3 sm:py-4 rounded-xl border border-slate-100 shadow-sm min-w-[120px] sm:min-w-[140px]">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">
                  Completed
                </p>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-xl sm:text-2xl font-bold text-slate-900">
                    {summary?.completed ?? 0}
                  </span>
                  <span className="text-[10px] text-green-500 font-bold">
                    / {summary?.total ?? 0}
                  </span>
                </div>
              </div>
              <div className="bg-white px-4 sm:px-5 py-3 sm:py-4 rounded-xl border border-slate-100 shadow-sm min-w-[120px] sm:min-w-[140px]">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">
                  Upcoming
                </p>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-xl sm:text-2xl font-bold text-slate-900">
                    {String(summary?.upcoming ?? 0).padStart(2, "0")}
                  </span>
                  <span className="text-[10px] text-indigo-600 font-bold">
                    Next 48h
                  </span>
                </div>
              </div>
            </div>
          </section>

          <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 lg:gap-8">
                <div className="xl:col-span-8 space-y-6 lg:space-y-8">
                  <QuickAccess spaces={spaces} />
                  <NotificationList notifications={notifications} />
                  <SpaceProgress spaces={spaces} tasks={tasks} />
                </div>
                <div className="xl:col-span-4 space-y-4">
                  <StatsPanel
                    summary={summary}
                    tasks={tasks}
                    activities={activities
                      .sort(
                        (a, b) =>
                          new Date(b.createdAt).getTime() -
                          new Date(a.createdAt).getTime(),
                      )
                      .slice(0, 5)}
                  />
                </div>
              </div>

              {attachments.length > 0 && (
                <section className="mt-12">
                  <h2 className="text-sm font-bold text-slate-900 mb-4">
                    Recently Modified
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
                    {attachments.slice(0, 6).map((attachment) => (
                      <div
                        key={attachment.id}
                        className="col-span-1 md:col-span-2 bg-white p-4 rounded-lg border border-slate-100 shadow-sm flex items-center gap-4"
                      >
                        <div className="w-12 h-12 bg-slate-50 rounded-lg flex items-center justify-center">
                          <FileText className="text-slate-400 w-6 h-6" />
                        </div>
                        <div className="flex-1">
                          <h4 className="text-sm font-bold text-slate-900">
                            {attachment.fileName}
                          </h4>
                          <p className="text-[10px] text-slate-400 mb-1.5">
                            {attachment.createdAt}
                          </p>
                          <span className="text-[12px] text-slate-500">
                            {attachment.task.name} · {attachment.task.list.name}{" "}
                            · {attachment.task.list.category.space.name}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              )}

          <div className="h-8" />
        </div>
      </div>
    </div>
  );
};

export default Home;
