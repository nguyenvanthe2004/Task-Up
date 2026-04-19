import {
  AlarmClockCheck,
  ArrowRight,
  Blend,
  CalendarCheck,
  Ellipsis,
  FileText,
  Folder,
  Gauge,
  SquarePlay,
  Star,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { Workspace } from "../../types/workspace";
import { callGetMyWorkspace } from "../../services/workspace";
import LoadingPage from "../ui/LoadingPage";
import CreateWorkspaceModal from "../workspaces/CreateWorkspaceModal";
import { useNavigate } from "react-router-dom";

const Home: React.FC = () => {
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(true);
  const navigate = useNavigate();

  const fetchWorkspaces = async () => {
    try {
      setLoading(true);
      const { data } = await callGetMyWorkspace();
      setWorkspaces(data);
    } catch (error: any) {
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWorkspaces();
  }, []);

  if (loading) {
    return <LoadingPage />;
  }
  if (workspaces.length === 0) {
    return (
      <CreateWorkspaceModal
        isOpen={open}
        onClose={() => {
          if (workspaces.length === 0) return;
          setOpen(false);
        }}
        onSuccess={(newWorkspace) => {
          setWorkspaces((prev) => [...prev, newWorkspace]);
          navigate(`/${newWorkspace.id}`);
        }}
      />
    );
  } else {
    return (
      <div className="min-h-screen bg-slate-50 font-sans">
        <div className="lg:pl-64 pt-10 min-h-screen">
          <div className="p-5 sm:p-6 lg:p-8 max-w-8xl">
            <section className="mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-5">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 mb-1.5">
                  Welcome back, Sarah 👋
                </h1>
                <p className="text-slate-500 text-sm">
                  You have{" "}
                  <span className="text-indigo-600 font-semibold">
                    4 high-priority tasks
                  </span>{" "}
                  for today.
                </p>
              </div>
              <div className="flex gap-3 sm:gap-4">
                <div className="bg-white px-4 sm:px-5 py-3 sm:py-4 rounded-xl border border-slate-100 shadow-sm min-w-[120px] sm:min-w-[140px]">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">
                    Completed
                  </p>
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-xl sm:text-2xl font-bold text-slate-900">
                      24
                    </span>
                    <span className="text-[10px] text-green-500 font-bold">
                      +12%
                    </span>
                  </div>
                </div>
                <div className="bg-white px-4 sm:px-5 py-3 sm:py-4 rounded-xl border border-slate-100 shadow-sm min-w-[120px] sm:min-w-[140px]">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">
                    Upcoming
                  </p>
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-xl sm:text-2xl font-bold text-slate-900">
                      08
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
                <section>
                  <div className="flex items-center gap-2 mb-4">
                    <span className="material-symbols-outlined text-indigo-600 text-[18px]">
                      <Star />
                    </span>
                    <h2 className="text-sm font-bold text-slate-900">
                      Quick Access
                    </h2>
                  </div>
                  <div className="grid grid-cols-1 xs:grid-cols-3 sm:grid-cols-3 gap-3 sm:gap-4">
                    {[
                      {
                        icon: <Folder />,
                        color: "bg-blue-50 text-blue-600",
                        title: "Product Launch",
                        sub: "Marketing Space",
                      },
                      {
                        icon: <Blend />,
                        color: "bg-purple-50 text-purple-600",
                        title: "Design System",
                        sub: "UX Design Team",
                      },
                      {
                        icon: <FileText />,
                        color: "bg-orange-50 text-orange-600",
                        title: "Q3 Roadmap",
                        sub: "Strategy Docs",
                      },
                    ].map(({ icon, color, title, sub }) => (
                      <div
                        key={title}
                        className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm hover:border-indigo-200 hover:shadow-md transition-all cursor-pointer group"
                      >
                        <div
                          className={`w-9 h-9 rounded-lg flex items-center justify-center mb-3 ${color}`}
                        >
                          <span className="material-symbols-outlined text-[20px]">
                            {icon}
                          </span>
                        </div>
                        <h4 className="text-sm font-bold text-slate-900 group-hover:text-indigo-700 transition-colors">
                          {title}
                        </h4>
                        <p className="text-[11px] text-slate-400 mt-0.5">
                          {sub}
                        </p>
                      </div>
                    ))}
                  </div>
                </section>

                {/* Today's Agenda */}
                <section className="bg-white p-5 sm:p-6 rounded-xl border border-slate-100 shadow-sm">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-indigo-600 text-[18px]">
                        <CalendarCheck />
                      </span>
                      <h2 className="text-sm font-bold text-slate-900">
                        Today's Agenda
                      </h2>
                    </div>
                    <button className="text-indigo-600 text-[11px] font-bold hover:underline flex items-center gap-1">
                      View Calendar
                      <span className="material-symbols-outlined text-[14px]">
                        <ArrowRight />
                      </span>
                    </button>
                  </div>
                  <div className="space-y-0">
                    {[
                      {
                        dot: "bg-indigo-600 ring-indigo-100",
                        title: "Daily Standup",
                        time: "09:30 AM",
                        sub: "Core Infrastructure Team",
                        badge: null,
                        showAvatars: true,
                      },
                      {
                        dot: "bg-pink-400 ring-pink-100",
                        title: "Design Review: Lumina Dashboard",
                        time: "11:00 AM",
                        sub: "Reviewing theme components",
                        badge: "Priority",
                        showAvatars: false,
                      },
                      {
                        dot: "bg-slate-300",
                        title: "Content Strategy Workshop",
                        time: "02:00 PM",
                        sub: "Defining editorial voice for Q4",
                        badge: null,
                        showAvatars: false,
                      },
                    ].map(
                      (
                        { dot, title, time, sub, badge, showAvatars },
                        i,
                        arr,
                      ) => (
                        <div key={title} className="flex gap-3 sm:gap-4">
                          <div className="flex flex-col items-center pt-1.5 flex-shrink-0">
                            <div
                              className={`w-2.5 h-2.5 rounded-full ring-4 flex-shrink-0 ${dot}`}
                            />
                            {i < arr.length - 1 && (
                              <div
                                className="w-px flex-1 bg-slate-100 my-1"
                                style={{ minHeight: 40 }}
                              />
                            )}
                          </div>
                          <div
                            className={`flex-1 pb-5 ${
                              i < arr.length - 1
                                ? "border-b border-slate-50"
                                : ""
                            }`}
                          >
                            <div className="flex flex-wrap justify-between items-start gap-1 mb-0.5">
                              <h4 className="text-sm font-bold text-slate-900 pr-2">
                                {title}
                              </h4>
                              <span className="text-[10px] font-bold text-slate-400 uppercase flex-shrink-0">
                                {time}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <p className="text-[12px] text-slate-500">
                                {sub}
                              </p>
                              {badge && (
                                <span className="bg-pink-50 text-pink-500 px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-tight flex-shrink-0">
                                  {badge}
                                </span>
                              )}
                            </div>
                            {showAvatars && (
                              <div className="flex -space-x-2 mt-2.5">
                                <img
                                  alt="user"
                                  className="w-6 h-6 rounded-full border-2 border-white object-cover"
                                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuCcylbjkB530VBN53zzarSaGvW85H8dM0We8JcY-mzr-0r6PCt0Fd7k_sSdpvX6enSjuwuaNQwiqFp2uf91usLD4XU84jXEylWqgClZraVCvy9FwHvi4VjW4aHDJSTMI-qTG-Vb9Szu16i10Hw7BDBUFziVebJz1bJ4666d3FWgUwcza3HiXWNkzG91oVhIumJErfU-xDQA_dWaZFYQfz21tad4x1xPj5nfJJcK8_dSQE-OA3ci4YM-pUJkE5tDk47b84OmNji_KTs"
                                />
                                <img
                                  alt="user"
                                  className="w-6 h-6 rounded-full border-2 border-white object-cover"
                                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuB2mWghlfsJpPVYOrAvAPa7xE4pkwbEHoeS3LtfZYrOvaOwyC1B-D-n2CpyDI31WZb3U-g8BUC0moISNVjoWzPKdwDjqbrIgU27TUckMWFCwgtsS4HmqylxccZgEQemEAxgMktHP_G2pO88FXPsQ4SnC2h6VL9Km79QQ45Amh7MM5kVaUtPYzglMggIORaXnDR1XBdXqE7nBAIlN4psLCCM3J9B-bRqlaeof_pzRJ7nvsmoiKtvKgZSLSvcyip4hXPZEMzwo8jrw4I"
                                />
                                <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-[8px] font-bold border-2 border-white text-slate-500">
                                  +3
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      ),
                    )}
                  </div>
                </section>
              </div>

              <div className="xl:col-span-4 space-y-6 lg:space-y-8">
                <section className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm">
                  <div className="flex items-center justify-between mb-5">
                    <h2 className="text-sm font-bold text-slate-900">
                      Space Progress
                    </h2>
                    <span className="material-symbols-outlined text-slate-300 text-[18px] cursor-pointer hover:text-slate-500 transition-colors">
                      <Ellipsis />
                    </span>
                  </div>
                  <div className="space-y-4">
                    {[
                      { label: "Marketing", pct: 82, opacity: "opacity-100" },
                      { label: "Development", pct: 45, opacity: "opacity-60" },
                      { label: "Operations", pct: 91, opacity: "opacity-80" },
                    ].map(({ label, pct, opacity }) => (
                      <div key={label}>
                        <div className="flex justify-between items-center mb-1.5">
                          <span className="text-[12px] font-bold text-slate-700">
                            {label}
                          </span>
                          <span className="text-[12px] font-bold text-indigo-600">
                            {pct}%
                          </span>
                        </div>
                        <div className="w-full h-1.5 bg-slate-50 rounded-full overflow-hidden">
                          <div
                            className={`bg-indigo-600 h-full rounded-full transition-all ${opacity}`}
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                  <button className="w-full mt-5 py-2 bg-slate-50 hover:bg-slate-100 text-slate-600 font-bold text-[11px] rounded-lg transition-all">
                    Manage All Spaces
                  </button>
                </section>

                <div className="grid grid-cols-2 xl:grid-cols-1 gap-3 xl:gap-4">
                  {[
                    {
                      icon: <Gauge />,
                      title: "Team Velocity",
                      value: "12.5",
                      unit: "tasks/day",
                      trend: {
                        icon: "trending_up",
                        label: "14% improvement",
                        color: "text-green-500",
                      },
                    },
                    {
                      icon: <AlarmClockCheck />,
                      title: "Time Saved",
                      value: "4.2",
                      unit: "hrs/week",
                      trend: {
                        icon: "horizontal_rule",
                        label: "Consistent",
                        color: "text-slate-400",
                      },
                    },
                  ].map(({ icon, title, value, unit, trend }) => (
                    <div
                      key={title}
                      className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm"
                    >
                      <div className="flex items-center gap-2.5 mb-3">
                        <div className="w-8 h-8 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 flex-shrink-0">
                          <span className="material-symbols-outlined text-[18px]">
                            {icon}
                          </span>
                        </div>
                        <h4 className="text-xs font-bold text-slate-900">
                          {title}
                        </h4>
                      </div>
                      <div className="flex items-baseline gap-1">
                        <span className="text-2xl font-bold text-slate-900">
                          {value}
                        </span>
                        <span className="text-[10px] font-medium text-slate-400">
                          {unit}
                        </span>
                      </div>
                      <div
                        className={`flex items-center gap-1 text-[10px] font-bold mt-1 ${trend.color}`}
                      >
                        <span className="material-symbols-outlined text-[12px]">
                          {trend.icon}
                        </span>
                        {trend.label}
                      </div>
                    </div>
                  ))}
                </div>

                <section className="relative overflow-hidden rounded-xl bg-gradient-to-br from-indigo-600 to-indigo-800 text-white p-5 sm:p-6">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
                  <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />
                  <div className="relative z-10">
                    <span className="inline-block text-[9px] font-bold uppercase tracking-widest opacity-70 mb-2 bg-white/10 px-2 py-0.5 rounded-full">
                      Premium Feature
                    </span>
                    <h3 className="text-base sm:text-lg font-bold mb-1 leading-snug">
                      Master your workflow with Velocity Pro.
                    </h3>
                    <p className="text-[11px] text-indigo-200 mb-4">
                      Unlock AI-powered automation and advanced analytics.
                    </p>
                    <button className="bg-white text-indigo-700 px-4 py-1.5 rounded-lg text-[11px] font-bold hover:bg-slate-50 transition-all shadow-sm">
                      Upgrade Now →
                    </button>
                  </div>
                </section>
              </div>
            </div>

            <section className="mt-8 lg:mt-12">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-bold text-slate-900">
                  Recently Modified
                </h2>
                <button className="text-indigo-600 text-[11px] font-bold hover:underline">
                  See all
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                {/* Featured Item */}
                <div className="sm:col-span-2 bg-white p-4 rounded-xl border border-slate-100 shadow-sm flex items-center gap-4 hover:border-indigo-200 hover:shadow-md transition-all cursor-pointer group">
                  <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-indigo-50 transition-colors">
                    <span className="material-symbols-outlined text-slate-400 text-2xl group-hover:text-indigo-500 transition-colors">
                      <FileText />
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-bold text-slate-900 group-hover:text-indigo-700 transition-colors">
                      Annual Budget.pdf
                    </h4>
                    <p className="text-[10px] text-slate-400 mb-1.5">
                      Edited 24 mins ago
                    </p>
                    <div className="flex gap-1.5">
                      <span className="px-1.5 py-0.5 rounded bg-slate-50 text-[8px] font-bold text-slate-500 uppercase tracking-tight border border-slate-100">
                        Finance
                      </span>
                      <span className="px-1.5 py-0.5 rounded bg-slate-50 text-[8px] font-bold text-slate-500 uppercase tracking-tight border border-slate-100">
                        Shared
                      </span>
                    </div>
                  </div>
                </div>

                {[
                  {
                    icon: <FileText />,
                    iconColor: "text-orange-400",
                    title: "Sprint Planning v2",
                    date: "Yesterday at 4:12 PM",
                  },
                  {
                    icon: <SquarePlay />,
                    iconColor: "text-blue-400",
                    title: "Board Deck Final",
                    date: "Aug 24, 2023",
                  },
                ].map(({ icon, iconColor, title, date }) => (
                  <div
                    key={title}
                    className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm hover:border-indigo-200 hover:shadow-md transition-all cursor-pointer group"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <span
                        className={`material-symbols-outlined text-[18px] ${iconColor}`}
                      >
                        {icon}
                      </span>
                      <span className="material-symbols-outlined text-slate-300 text-[16px] cursor-pointer hover:text-slate-500 transition-colors">
                        more_horiz
                      </span>
                    </div>
                    <h4 className="text-sm font-bold text-slate-900 truncate group-hover:text-indigo-700 transition-colors">
                      {title}
                    </h4>
                    <p className="text-[10px] text-slate-400 mt-0.5">{date}</p>
                  </div>
                ))}
              </div>
            </section>

            <div className="h-8" />
          </div>
        </div>

        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200"
          rel="stylesheet"
        />
      </div>
    );
  }
};

export default Home;
