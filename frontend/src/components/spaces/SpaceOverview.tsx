import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import CustomTable from "../ui/CustomTable";
import { priorityBadge, statusBadge } from "../../constants";
import { Task, TaskGroup } from "../../types/task";
import KanbanBoard from "../tasks/KanbanBoard";
import CalendarView from "../tasks/CalendarView";
import DetailTask from "../tasks/DetailTask";
import ListView from "../tasks/ListView";

type SpaceView = "overview" | "list" | "kanban" | "calendar";

const SpaceOverview: React.FC = () => {
  const [view, setView] = useState<SpaceView>("overview");
  const [activeFolder, setActiveFolder] = useState<string | null>(null);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const navigate = useNavigate();

  const folders = [
    {
      id: "creative",
      name: "Creative Brand Folder",
      icon: "folder",
      color: "text-amber-500 bg-amber-50",
      count: 12,
      updated: "5h ago",
      files: [
        {
          name: "Brand_Guidelines_v3.pdf",
          type: "pdf",
          size: "4.2 MB",
          by: "Sarah Jenkins",
          time: "5h ago",
        },
        {
          name: "Logo_Assets_Final.zip",
          type: "zip",
          size: "18 MB",
          by: "Sarah Jenkins",
          time: "5h ago",
        },
        {
          name: "Color_Palette_2024.fig",
          type: "fig",
          size: "2.1 MB",
          by: "Sarah Jenkins",
          time: "5h ago",
        },
      ],
    },
    {
      id: "strategy",
      name: "Strategy & Planning",
      icon: "folder_special",
      color: "text-blue-500 bg-blue-50",
      count: 8,
      updated: "1d ago",
      files: [
        {
          name: "Q4_Strategy_Deck_v2.pdf",
          type: "pdf",
          size: "3.7 MB",
          by: "Sarah",
          time: "2h ago",
        },
        {
          name: "Budget_Allocation_FY24.xls",
          type: "xls",
          size: "1.2 MB",
          by: "Marc",
          time: "1d ago",
        },
        {
          name: "Competitor_Analysis.docx",
          type: "doc",
          size: "980 KB",
          by: "David Chen",
          time: "2d ago",
        },
      ],
    },
    {
      id: "influencer",
      name: "Influencer Contracts",
      icon: "folder_shared",
      color: "text-purple-500 bg-purple-50",
      count: 5,
      updated: "3h ago",
      files: [
        {
          name: "TikTok_Contract_Draft.pdf",
          type: "pdf",
          size: "1.1 MB",
          by: "Legal",
          time: "3h ago",
        },
        {
          name: "NDA_Template_2024.docx",
          type: "doc",
          size: "456 KB",
          by: "Legal",
          time: "1d ago",
        },
      ],
    },
    {
      id: "ad-creative",
      name: "Ad Creative Assets",
      icon: "folder_copy",
      color: "text-pink-500 bg-pink-50",
      count: 21,
      updated: "30m ago",
      files: [
        {
          name: "Banner_1080x1080.png",
          type: "img",
          size: "2.8 MB",
          by: "Design Team",
          time: "30m ago",
        },
        {
          name: "Story_Template_v2.psd",
          type: "psd",
          size: "45 MB",
          by: "Design Team",
          time: "2h ago",
        },
        {
          name: "Video_Thumbnail_Set.zip",
          type: "zip",
          size: "12 MB",
          by: "Design Team",
          time: "3h ago",
        },
      ],
    },
  ];

  const recentFiles = [
    {
      name: "Q4_Strategy_Deck_v2.pdf",
      type: "pdf",
      folder: "Strategy & Planning",
      by: "Sarah",
      time: "2h ago",
    },
    {
      name: "Budget_Allocation_FY24.xls",
      type: "xls",
      folder: "Strategy & Planning",
      by: "Marc",
      time: "1d ago",
    },
    {
      name: "Brand_Guidelines_v3.pdf",
      type: "pdf",
      folder: "Creative Brand Folder",
      by: "Sarah Jenkins",
      time: "5h ago",
    },
    {
      name: "TikTok_Contract_Draft.pdf",
      type: "pdf",
      folder: "Influencer Contracts",
      by: "Legal",
      time: "3h ago",
    },
    {
      name: "Banner_1080x1080.png",
      type: "img",
      folder: "Ad Creative Assets",
      by: "Design Team",
      time: "30m ago",
    },
  ];

  const getFileIcon = (type: string) => {
    const map: Record<string, { icon: string; color: string }> = {
      pdf: { icon: "description", color: "bg-blue-50 text-blue-600" },
      xls: { icon: "table_chart", color: "bg-purple-50 text-purple-600" },
      doc: { icon: "article", color: "bg-indigo-50 text-indigo-600" },
      img: { icon: "image", color: "bg-green-50 text-green-600" },
      png: { icon: "image", color: "bg-green-50 text-green-600" },
      zip: { icon: "folder_zip", color: "bg-amber-50 text-amber-600" },
      fig: { icon: "draw", color: "bg-pink-50 text-pink-600" },
      psd: { icon: "palette", color: "bg-pink-50 text-pink-600" },
    };
    return map[type] || { icon: "draft", color: "bg-slate-50 text-slate-600" };
  };

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
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
          <div>
            <nav className="flex items-center gap-2 mb-2">
              <button
                onClick={() => navigate(-1)}
                className="text-[0.6875rem] font-medium text-on-surface-variant uppercase tracking-widest hover:text-primary transition-colors"
              >
                Spaces
              </button>
              <span className="material-symbols-outlined text-[0.6875rem] text-outline">
                chevron_right
              </span>
              <span className="text-[0.6875rem] font-medium text-on-surface-variant uppercase tracking-widest">
                Marketing Q4
              </span>
            </nav>
            <h2 className="text-[1.5rem] font-extrabold text-on-surface tracking-tight">
              Marketing Q4 Launch
            </h2>
            <p className="text-on-surface-variant mt-1">
              Coordination for Q4 product releases and brand campaigns.
            </p>
          </div>

          <div className="flex items-center gap-4">
            {/* ── View switcher ── */}
            <div className="flex bg-stone-100 rounded-xl p-1 gap-0.5">
              {VIEW_TABS.map(({ key, icon, label }) => (
                <button
                  key={key}
                  onClick={() => setView(key)}
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
              onClick={() => navigate("/spaces/members")}
              className="flex -space-x-2"
            >
              <img
                className="w-8 h-8 rounded-full border-2 border-surface-container-lowest"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuADkwurbZVIP0oNv8tLXXMa9ZCC5EUgJdiDDarGlCq9AiYT-oi6sdH1Uf2Zwfq0YLFFZD9-LvX8LsHr0eCsEr-9rlUwA1AhbCEnbiAe_M7FO3I3CFz7oICvsKMb74N8pTFRVCyiMU8BUVBbwptSGR4F4-y4bM3fivEPUSUqrhFy1R3qvsTEAr897tOvFz7vyKPs8tXUofGnOH025tHc2lzazYkDyvHNe8XL5jxD95m90WnF2agPypcbXUg0I3p--lnNTQpqxHzhTkE"
                alt=""
              />
              <img
                className="w-8 h-8 rounded-full border-2 border-surface-container-lowest"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDSqHV0fmLb20ERcVBfNcjD_b-9BEfHIzU3gUYyKCzYl-7WxC_eW1HyqAVbqXLyY4IuIyxnEjFplu1ig-HeIdN0iJa9ls7AjoEUreDVq6Rp753jxDXZf5UpnSa5wNO8a5wNxaDklJUxsivD7aroB4aYe2nfQY68bwF4yWMVWlX7siEesWfS9p9bQIZdiDqRNZqC3PLLiXS2PHzynt20sGHG1Oh5XLwcP1EOAA5sGwILNJaxnMgfKlKshwSGSuSULT4PgO1ipDArmqc"
                alt=""
              />
              <img
                className="w-8 h-8 rounded-full border-2 border-surface-container-lowest"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCrXW0TdjAu0w0sw_OHifet5oGgcASAbJPNnBK8jzRd5CzrJHdzlKcd2DHVaHe95u-QHIti6vg-9xVwN7zui5O_751INcoVyFw5lAPhZ_Ns-gCRYdLFQXxOxx2sWgFZa4sytFagQxUtHtLxRguCFgEEXZRWrLEDuL2iYjhBXyovRBhCeAYyw_5otkm9TeGFzVxzeeketTwkCoVAlZhJ6JDRrB6jT9CuTBMF5aYU0tQYTrLeEw0AYT-pRu0KX6JlwO6YDcmYmtgt9ZY"
                alt=""
              />
              <div className="w-8 h-8 rounded-full bg-slate-200 border-2 border-surface-container-lowest flex items-center justify-center text-[10px] font-bold text-slate-600">
                +12
              </div>
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
            <div className="col-span-12">
              <div className="bg-surface-container-lowest rounded-xl shadow-sm border border-white/50 overflow-hidden">
                <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                  <h3 className="text-sm font-bold text-on-surface flex items-center gap-2">
                    <span
                      className="material-symbols-outlined text-lg text-primary"
                      style={{ fontVariationSettings: "'FILL' 1" }}
                    >
                      folder_open
                    </span>
                    Files &amp; Folders
                  </h3>
                  <div className="flex items-center gap-2">
                    <button className="flex items-center gap-1.5 text-[0.6875rem] font-bold text-on-surface-variant hover:text-primary px-3 py-1.5 rounded-lg hover:bg-slate-50 transition-colors">
                      <span className="material-symbols-outlined text-[14px]">
                        upload
                      </span>
                      Upload
                    </button>
                    <button className="flex items-center gap-1.5 text-[0.6875rem] font-bold text-on-surface-variant hover:text-primary px-3 py-1.5 rounded-lg hover:bg-slate-50 transition-colors">
                      <span className="material-symbols-outlined text-[14px]">
                        create_new_folder
                      </span>
                      New Folder
                    </button>
                  </div>
                </div>
                <div className="p-6 border-b border-slate-50">
                  <p className="text-[0.6875rem] font-bold text-on-surface-variant uppercase tracking-wider mb-4">
                    Folders
                  </p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {folders.map((folder) => (
                      <button
                        key={folder.id}
                        onClick={() =>
                          setActiveFolder(
                            activeFolder === folder.id ? null : folder.id,
                          )
                        }
                        className={`flex items-center gap-3 p-3 rounded-xl border transition-all text-left group ${
                          activeFolder === folder.id
                            ? "border-primary bg-primary-container/20"
                            : "border-outline-variant hover:border-primary hover:bg-slate-50"
                        }`}
                      >
                        <div
                          className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${folder.color}`}
                        >
                          <span
                            className="material-symbols-outlined text-[22px]"
                            style={{ fontVariationSettings: "'FILL' 1" }}
                          >
                            {folder.icon}
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-[0.6875rem] font-bold text-on-surface truncate">
                            {folder.name}
                          </p>
                          <p className="text-[0.625rem] text-on-surface-variant">
                            {folder.count} files • {folder.updated}
                          </p>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
                {activeFolder && (
                  <div className="p-6 border-b border-slate-50 bg-slate-50/50">
                    <div className="flex items-center gap-2 mb-4">
                      <span className="material-symbols-outlined text-[14px] text-primary">
                        subdirectory_arrow_right
                      </span>
                      <p className="text-[0.6875rem] font-bold text-primary uppercase tracking-wider">
                        {folders.find((f) => f.id === activeFolder)?.name}
                      </p>
                    </div>
                    <div className="space-y-1">
                      {folders
                        .find((f) => f.id === activeFolder)
                        ?.files.map((file, i) => {
                          const { icon, color } = getFileIcon(file.type);
                          return (
                            <div
                              key={i}
                              className="flex items-center gap-3 p-2.5 hover:bg-white rounded-lg transition-colors cursor-pointer group"
                            >
                              <div
                                className={`w-8 h-8 flex items-center justify-center rounded ${color}`}
                              >
                                <span
                                  className="material-symbols-outlined text-lg"
                                  style={{ fontVariationSettings: "'FILL' 1" }}
                                >
                                  {icon}
                                </span>
                              </div>
                              <div className="flex-1">
                                <p className="text-[0.6875rem] font-bold text-on-surface">
                                  {file.name}
                                </p>
                                <p className="text-[0.625rem] text-on-surface-variant uppercase">
                                  {file.size} • by {file.by} • {file.time}
                                </p>
                              </div>
                              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button className="p-1 hover:bg-slate-100 rounded">
                                  <span className="material-symbols-outlined text-sm text-outline">
                                    download
                                  </span>
                                </button>
                                <button className="p-1 hover:bg-slate-100 rounded">
                                  <span className="material-symbols-outlined text-sm text-outline">
                                    more_vert
                                  </span>
                                </button>
                              </div>
                            </div>
                          );
                        })}
                    </div>
                  </div>
                )}
                <div className="p-6">
                  <p className="text-[0.6875rem] font-bold text-on-surface-variant uppercase tracking-wider mb-4">
                    Recently Modified
                  </p>
                  <div className="divide-y divide-slate-50">
                    {recentFiles.map((file, i) => {
                      const { icon, color } = getFileIcon(file.type);
                      return (
                        <div
                          key={i}
                          className="flex items-center gap-4 py-3 hover:bg-slate-50 px-2 rounded-lg -mx-2 transition-colors cursor-pointer group"
                        >
                          <div
                            className={`w-9 h-9 flex items-center justify-center rounded-lg ${color}`}
                          >
                            <span
                              className="material-symbols-outlined text-lg"
                              style={{ fontVariationSettings: "'FILL' 1" }}
                            >
                              {icon}
                            </span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-[0.6875rem] font-bold text-on-surface truncate">
                              {file.name}
                            </p>
                            <p className="text-[0.625rem] text-on-surface-variant uppercase">
                              {file.folder} • by {file.by}
                            </p>
                          </div>
                          <span className="text-[0.625rem] text-outline whitespace-nowrap">
                            {file.time}
                          </span>
                          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button className="p-1 hover:bg-slate-100 rounded">
                              <span className="material-symbols-outlined text-sm text-outline">
                                download
                              </span>
                            </button>
                            <button className="p-1 hover:bg-slate-100 rounded">
                              <span className="material-symbols-outlined text-sm text-outline">
                                more_vert
                              </span>
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        {view === "list" && <ListView />}

        {view === "kanban" && <KanbanBoard />}

        {view === "calendar" && <CalendarView />}

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
