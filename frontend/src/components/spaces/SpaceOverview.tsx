import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { Task } from "../../types/task";
import DetailTask from "../tasks/DetailTask";
import Categories from "../categories/Categories";
import { Space } from "../../types/space";
import { toastError } from "../../lib/toast";
import { callGetSpaceById } from "../../services/space";
import { AvatarStack } from "../ui/AvatarStack";
import SpaceListView from "./SpaceListView";
import SpaceBoardView from "./SpaceBoardView";
import SpaceCalendarView from "./SpaceCalendarView";
import { Workspace } from "../../types/workspace";
import { RootState } from "../../redux/store";
import { useSelector } from "react-redux";

type SpaceView = "overview" | "list" | "kanban" | "calendar";

const SpaceOverview: React.FC = () => {
  const { spaceId } = useParams<{ spaceId: string }>();
  const { workspaceId } = useParams();
  const [searchParams] = useSearchParams();
  const modeView = searchParams.get("mode");
  const [view, setView] = useState<SpaceView>("overview");
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const navigate = useNavigate();
  const [space, setSpace] = useState<Space | null>(null);

  const onClick = (mode: SpaceView) => {
    navigate(`/${workspaceId}/spaces/${spaceId}?mode=${mode}`);
  };

  const fetchSpaceDetails = async () => {
    try {
      const res = await callGetSpaceById(Number(spaceId));
      setSpace(res.data);
    } catch (error: any) {
      toastError(error.message);
    }
  };

  useEffect(() => {
    fetchSpaceDetails();
    !modeView ? setView("overview") : setView(modeView as SpaceView);
  }, [spaceId, modeView]);

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
            {/* ── View switcher ── */}
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
            {/* Avatars */}
            <div
              onClick={() => navigate("members")}
              className="flex -space-x-2 pt-4 cursor-pointer"
            >
              <AvatarStack members={space?.members || []} />
            </div>
          </div>
        </div>

        {view === "overview" && (
          <div className="grid grid-cols-12 gap-6 mt-10">
            {/* Stats row */}
            <div className="col-span-12 lg:col-span-8 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-surface-container-lowest p-5 rounded-xl shadow-sm flex flex-col justify-between h-32">
                <div className="flex justify-between items-start">
                  <span className="text-[0.6875rem] font-bold text-on-surface-variant uppercase tracking-wider">
                    Completion
                  </span>
                  <span className="material-symbols-outlined text-primary text-sm">
                    donut_large
                  </span>
                </div>
                <div className="mt-4">
                  <div className="flex items-end justify-between mb-2">
                    <span className="text-2xl font-black text-on-surface">
                      68%
                    </span>
                    <span className="text-[0.6875rem] text-primary font-bold">
                      +12% this wk
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                    <div
                      className="bg-primary h-full rounded-full"
                      style={{ width: "68%" }}
                    ></div>
                  </div>
                </div>
              </div>
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
                    24
                  </span>
                  <p className="text-[0.6875rem] text-on-surface-variant font-medium mt-1">
                    4 urgent blockers remaining
                  </p>
                </div>
              </div>
              <div className="bg-surface-container-lowest p-5 rounded-xl shadow-sm flex flex-col justify-between h-32">
                <div className="flex justify-between items-start">
                  <span className="text-[0.6875rem] font-bold text-on-surface-variant uppercase tracking-wider">
                    Member Pulse
                  </span>
                  <span className="material-symbols-outlined text-secondary text-sm">
                    groups
                  </span>
                </div>
                <div className="mt-4">
                  <span className="text-2xl font-black text-on-surface">
                    92%
                  </span>
                  <p className="text-[0.6875rem] text-on-surface-variant font-medium mt-1">
                    Avg response time: 14m
                  </p>
                </div>
              </div>
            </div>

            {/* Common Assets */}
            <div className="col-span-12 lg:col-span-4 bg-surface-container-lowest p-6 rounded-xl shadow-sm border border-white/50">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold text-on-surface flex items-center gap-2">
                  <span className="material-symbols-outlined text-lg">
                    folder_open
                  </span>
                  Common Assets
                </h3>
                <button className="text-[0.6875rem] font-bold text-primary hover:underline">
                  View All
                </button>
              </div>
              <ul className="space-y-3">
                <li className="flex items-center gap-3 p-2 hover:bg-slate-50 rounded-lg transition-colors cursor-pointer group">
                  <div className="w-8 h-8 bg-blue-50 flex items-center justify-center rounded text-blue-600">
                    <span
                      className="material-symbols-outlined text-lg"
                      style={{ fontVariationSettings: "'FILL' 1" }}
                    >
                      description
                    </span>
                  </div>
                  <div className="flex-1">
                    <p className="text-[0.6875rem] font-bold text-on-surface truncate">
                      Q4_Strategy_Deck_v2.pdf
                    </p>
                    <p className="text-[0.625rem] text-on-surface-variant uppercase">
                      Shared by Sarah • 2h ago
                    </p>
                  </div>
                  <span className="material-symbols-outlined text-sm text-outline opacity-0 group-hover:opacity-100">
                    download
                  </span>
                </li>
                <li className="flex items-center gap-3 p-2 hover:bg-slate-50 rounded-lg transition-colors cursor-pointer group">
                  <div className="w-8 h-8 bg-purple-50 flex items-center justify-center rounded text-purple-600">
                    <span
                      className="material-symbols-outlined text-lg"
                      style={{ fontVariationSettings: "'FILL' 1" }}
                    >
                      table_chart
                    </span>
                  </div>
                  <div className="flex-1">
                    <p className="text-[0.6875rem] font-bold text-on-surface truncate">
                      Budget_Allocation_FY24.xls
                    </p>
                    <p className="text-[0.625rem] text-on-surface-variant uppercase">
                      Updated by Marc • 1d ago
                    </p>
                  </div>
                  <span className="material-symbols-outlined text-sm text-outline opacity-0 group-hover:opacity-100">
                    download
                  </span>
                </li>
              </ul>
            </div>

            {/* Pinned Priorities */}
            <div className="col-span-12 lg:col-span-8">
              <div className="bg-surface-container-lowest rounded-xl shadow-sm border border-white/50 overflow-hidden">
                <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                  <h3 className="text-sm font-bold text-on-surface flex items-center gap-2">
                    <span
                      className="material-symbols-outlined text-lg text-primary"
                      style={{ fontVariationSettings: "'FILL' 1" }}
                    >
                      push_pin
                    </span>
                    Pinned Priorities
                  </h3>
                  <button className="p-1.5 hover:bg-slate-100 rounded">
                    <span className="material-symbols-outlined text-sm">
                      more_horiz
                    </span>
                  </button>
                </div>
                <div className="divide-y divide-slate-50">
                  <div className="p-6 hover:bg-slate-50/50 transition-colors flex items-center gap-4">
                    <div className="w-5 h-5 border-2 border-outline-variant rounded flex items-center justify-center cursor-pointer hover:border-primary"></div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-medium text-on-surface">
                          Finalize influencer contract for TikTok blast
                        </h4>
                        <span className="bg-tertiary-container text-[0.625rem] font-bold px-2 py-0.5 rounded-full text-on-tertiary-container uppercase">
                          High Priority
                        </span>
                      </div>
                      <div className="flex items-center gap-4 mt-1">
                        <span className="text-[0.6875rem] text-on-surface-variant flex items-center gap-1">
                          <span className="material-symbols-outlined text-[14px]">
                            event
                          </span>{" "}
                          Due Oct 24
                        </span>
                        <span className="text-[0.6875rem] text-on-surface-variant flex items-center gap-1">
                          <span className="material-symbols-outlined text-[14px]">
                            comment
                          </span>{" "}
                          12 comments
                        </span>
                      </div>
                    </div>
                    <img
                      className="w-6 h-6 rounded-full border border-white"
                      src="https://i.pravatar.cc/100?img=1"
                      alt=""
                    />
                  </div>
                  <div className="p-6 hover:bg-slate-50/50 transition-colors flex items-center gap-4">
                    <div className="w-5 h-5 border-2 border-outline-variant rounded flex items-center justify-center cursor-pointer hover:border-primary"></div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-medium text-on-surface">
                          Prepare Q4 Ad creative assets for review
                        </h4>
                        <span className="bg-secondary-container text-[0.625rem] font-bold px-2 py-0.5 rounded-full text-on-secondary-container uppercase">
                          Marketing
                        </span>
                      </div>
                      <div className="flex items-center gap-4 mt-1">
                        <span className="text-[0.6875rem] text-on-surface-variant flex items-center gap-1">
                          <span className="material-symbols-outlined text-[14px]">
                            event
                          </span>{" "}
                          Due Oct 28
                        </span>
                        <span className="text-[0.6875rem] text-on-surface-variant flex items-center gap-1">
                          <span className="material-symbols-outlined text-[14px]">
                            attach_file
                          </span>{" "}
                          4 assets
                        </span>
                      </div>
                    </div>
                    <img
                      className="w-6 h-6 rounded-full border border-white"
                      src="https://i.pravatar.cc/100?img=2"
                      alt=""
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="col-span-12 lg:col-span-4 bg-surface-container-lowest p-6 rounded-xl shadow-sm border border-white/50 h-fit">
              <h3 className="text-sm font-bold text-on-surface flex items-center gap-2 mb-6">
                <span className="material-symbols-outlined text-lg">
                  history
                </span>
                Recent Activity
              </h3>
              <div className="space-y-6 relative before:content-[''] before:absolute before:left-[11px] before:top-2 before:bottom-0 before:w-px before:bg-slate-100">
                <div className="relative pl-8">
                  <div className="absolute left-0 top-1 w-[22px] h-[22px] bg-white border-2 border-primary rounded-full flex items-center justify-center z-10">
                    <span className="material-symbols-outlined text-[12px] text-primary">
                      chat
                    </span>
                  </div>
                  <p className="text-[0.6875rem] text-on-surface leading-snug">
                    <span className="font-bold">David Chen</span> commented on{" "}
                    <span className="text-primary font-semibold">
                      Q4_Influencers
                    </span>
                  </p>
                  <p className="text-[0.625rem] text-on-surface-variant uppercase mt-1">
                    14 minutes ago
                  </p>
                </div>
                <div className="relative pl-8">
                  <div className="absolute left-0 top-1 w-[22px] h-[22px] bg-white border-2 border-secondary rounded-full flex items-center justify-center z-10">
                    <span className="material-symbols-outlined text-[12px] text-secondary">
                      check_circle
                    </span>
                  </div>
                  <p className="text-[0.6875rem] text-on-surface leading-snug">
                    <span className="font-bold">System</span> marked{" "}
                    <span className="font-semibold text-on-surface">
                      Brand Audit
                    </span>{" "}
                    as complete.
                  </p>
                  <p className="text-[0.625rem] text-on-surface-variant uppercase mt-1">
                    2 hours ago
                  </p>
                </div>
                <div className="relative pl-8">
                  <div className="absolute left-0 top-1 w-[22px] h-[22px] bg-white border-2 border-tertiary rounded-full flex items-center justify-center z-10">
                    <span className="material-symbols-outlined text-[12px] text-tertiary">
                      upload_file
                    </span>
                  </div>
                  <p className="text-[0.6875rem] text-on-surface leading-snug">
                    <span className="font-bold">Sarah Jenkins</span> uploaded 3
                    new assets to{" "}
                    <span className="font-semibold text-on-surface">
                      Creative Brand Folder
                    </span>
                    .
                  </p>
                  <p className="text-[0.625rem] text-on-surface-variant uppercase mt-1">
                    5 hours ago
                  </p>
                </div>
              </div>
            </div>

            {/* Files & Folders */}
            <Categories />
          </div>
        )}

        {view === "list" && <SpaceListView />}
        {view === "kanban" && <SpaceBoardView />}
        {view === "calendar" && <SpaceCalendarView />}

        {(view === "overview" || view === "list") && selectedTask && (
          <DetailTask
            task={selectedTask}
            onClose={() => setSelectedTask(null)}
          />
        )}
      </div>
    </main>
  );
};

export default SpaceOverview;
