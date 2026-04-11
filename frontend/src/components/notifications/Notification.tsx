import { AtSign, Calendar, CircleCheckBig, Pencil, ShieldAlert, SquareUser } from "lucide-react";
import type React from "react";
import { useNavigate } from "react-router-dom";

const Notification: React.FC = () => {
  const navigate = useNavigate();

  return (
    <main className="lg:ml-64 pt-16 px-6 mt-10 md:px-10 pb-16 min-h-screen bg-slate-50 :bg-slate-900">
      <div className="max-w-8xl mx-auto">
        {/* HEADER */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 :text-white tracking-tight">
              Notification Center
            </h1>
            <p className="text-sm text-slate-500 :text-slate-400 mt-1">
              Manage your updates, mentions and system activities.
            </p>
          </div>

          {/* FILTER */}
          <div className="flex items-center p-1 bg-white :bg-slate-800 border border-slate-200 :border-slate-700 rounded-xl shadow-sm">
            {["All", "Unread", "Mentions"].map((item, i) => (
              <button
                key={item}
                className={`px-4 py-1.5 text-sm rounded-lg transition-all font-medium
                  ${
                    i === 0
                      ? "bg-indigo-600 text-white shadow-sm"
                      : "text-slate-500 :text-slate-400 hover:bg-slate-100 :hover:bg-slate-700"
                  }`}
              >
                {item}
              </button>
            ))}
          </div>
        </header>

        {/* CONTENT */}
        <div className="space-y-14">
          {/* TODAY */}
          <section>
            <h3 className="text-xs font-bold uppercase tracking-widest text-indigo-600 :text-indigo-400 mb-6">
              Today
            </h3>

            <div className="space-y-4">
              {/* ITEM */}
              <div className="group flex gap-4 p-5 bg-white :bg-slate-800 rounded-xl border border-slate-200 :border-slate-700 hover:shadow-md hover:border-indigo-300 :hover:border-indigo-500/40 transition-all cursor-pointer">
                {/* ICON */}
                <div className="w-10 h-10 rounded-full flex items-center justify-center bg-indigo-100 :bg-indigo-900/40 text-indigo-600 :text-indigo-300">
                  <span className="material-symbols-outlined text-xl">
                    <AtSign />
                  </span>
                </div>

                {/* CONTENT */}
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-1">
                    <p className="text-sm text-slate-600 :text-slate-300 leading-relaxed">
                      <span className="font-semibold text-slate-900 :text-white">
                        Sarah Jenkins
                      </span>{" "}
                      mentioned you in{" "}
                      <span className="font-semibold text-indigo-600 :text-indigo-400">
                        Product Roadmap 2024
                      </span>
                    </p>

                    <span className="text-[11px] font-semibold text-indigo-600 :text-indigo-400 whitespace-nowrap">
                      JUST NOW
                    </span>
                  </div>

                  <p className="text-sm text-slate-500 :text-slate-400 italic mb-4">
                    "@architect-team, we need to finalize the glassmorphism
                    parameters..."
                  </p>

                  <div className="flex gap-2">
                    <button className="px-3 py-1 text-xs font-semibold rounded-md bg-indigo-600 text-white hover:bg-indigo-700 transition">
                      Reply
                    </button>
                    <button className="px-3 py-1 text-xs font-semibold rounded-md bg-slate-100 :bg-slate-700 text-slate-600 :text-slate-300 hover:bg-slate-200 :hover:bg-slate-600 transition">
                      Dismiss
                    </button>
                  </div>
                </div>
              </div>

              {/* ITEM 2 */}
              <div className="group flex gap-4 p-5 bg-white :bg-slate-800 rounded-xl border border-slate-200 :border-slate-700 hover:shadow-md hover:border-emerald-300 :hover:border-emerald-500/40 transition-all cursor-pointer">
                <div className="w-10 h-10 rounded-full flex items-center justify-center bg-emerald-100 :bg-emerald-900/40 text-emerald-600 :text-emerald-300">
                  <span className="material-symbols-outlined text-xl">
                    <CircleCheckBig />
                  </span>
                </div>

                <div className="flex-1">
                  <div className="flex justify-between items-start mb-2">
                    <p className="text-sm text-slate-600 :text-slate-300">
                      <span className="font-semibold text-slate-900 :text-white">
                        System
                      </span>{" "}
                      updated status to{" "}
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-100 :bg-emerald-900/40 text-emerald-700 :text-emerald-300 uppercase">
                        Completed
                      </span>
                    </p>

                    <span className="text-[11px] text-slate-400">14M AGO</span>
                  </div>

                  <p className="text-sm text-slate-500 :text-slate-400">
                    Task{" "}
                    <span className="font-medium text-slate-700 :text-slate-200">
                      "API Infrastructure Migration"
                    </span>{" "}
                    has been resolved.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* YESTERDAY */}
          <section>
            <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 :text-slate-500 mb-6">
              Yesterday
            </h3>

            <div className="space-y-4 opacity-80">
              {/* ITEM */}
              <div className="flex gap-4 p-5 rounded-xl border border-slate-200/60 :border-slate-700/60 bg-slate-50 :bg-slate-800/40 hover:bg-white :hover:bg-slate-800 transition cursor-pointer">
                <div className="w-10 h-10 flex items-center justify-center rounded-full bg-slate-200 :bg-slate-700 text-slate-500">
                  <span className="material-symbols-outlined text-xl">
                    <SquareUser />
                  </span>
                </div>

                <div className="flex-1">
                  <div className="flex justify-between mb-2">
                    <p className="text-sm text-slate-600 :text-slate-400">
                      <span className="font-semibold text-slate-800 :text-slate-200">
                        Marcus Thorne
                      </span>{" "}
                      assigned you to{" "}
                      <span className="font-semibold text-slate-800 :text-slate-200">
                        Brand Identity Audit
                      </span>
                    </p>

                    <span className="text-[11px] text-slate-400">OCT 23</span>
                  </div>

                  <div className="flex gap-4 text-xs">
                    <div className="flex items-center gap-1 text-slate-500">
                      <span className="material-symbols-outlined text-sm">
                        <Calendar />
                      </span>
                      Due Oct 31
                    </div>

                    <div className="flex items-center gap-1 text-amber-600 font-semibold">
                      <span className="material-symbols-outlined text-sm">
                        <ShieldAlert />
                      </span>
                      High Priority
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* EMPTY STATE */}
        <div className="mt-20 text-center py-12">
          <span className="material-symbols-outlined text-3xl text-slate-300 :text-slate-600">
            auto_awesome
          </span>
          <p className="text-sm text-slate-400 mt-3">You're all caught up.</p>
        </div>
      </div>
      <button className="fixed bottom-8 right-8 w-14 h-14 rounded-full bg-indigo-600 text-white flex items-center justify-center shadow-lg hover:shadow-indigo-500/30 hover:bg-indigo-700 active:scale-90 transition-all z-50">
        <span className="material-symbols-outlined text-2xl" data-icon="edit">
          <Pencil />
        </span>
      </button>
    </main>
  );
};

export default Notification;
