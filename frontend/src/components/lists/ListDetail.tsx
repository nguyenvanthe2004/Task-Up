import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Task } from "../../types/task";
import KanbanBoard from "../tasks/KanbanBoard";
import CalendarView from "../tasks/CalendarView";
import DetailTask from "../tasks/DetailTask";
import ListView from "../tasks/ListView";
import { Space } from "../../types/space";
import { toastError } from "../../lib/toast";
import { callGetSpaceById } from "../../services/space";
import { List } from "../../types/list";
import { callGetListById } from "../../services/list";
import { Category } from "../../types/category";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { Workspace } from "../../types/workspace";

type ListView = "list" | "kanban" | "calendar";

const ListDetail: React.FC = () => {
  const { listId } = useParams<{ listId: string }>();
  const { workspaceId } = useParams();
  const [view, setView] = useState<ListView>("list");
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const navigate = useNavigate();
  const [list, setList] = useState<List | null>(null);
  const [category, setCategory] = useState<Category | null>(null);
  const [space, setSpace] = useState<Space | null>(null);
  const [exportOpen, setExportOpen] = useState(false);
  const exportRef = useRef<HTMLDivElement>(null);
  const importRef = useRef<HTMLInputElement>(null);

  const user = useSelector((state: RootState) => state.auth.currentUser);
  const userWorkspaces: Workspace[] = user?.workspaces ?? [];
  const workspace = userWorkspaces.find((w) => w.id === Number(workspaceId));

  const fetchData = async () => {
    try {
      const res = await callGetListById(Number(listId));
      const listData = res.data;
      setList(res.data);
      const cat = listData?.category ?? null;
      setCategory(cat);
      if (cat?.spaceId) {
        const res = await callGetSpaceById(Number(cat.spaceId));
        setSpace(res.data);
      }
    } catch (error: any) {
      toastError(error.message);
    }
  };

  useEffect(() => {
    if (!listId) return;
    fetchData();
  }, [listId]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (exportRef.current && !exportRef.current.contains(e.target as Node)) {
        setExportOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    // TODO: handle import logic
    console.log("Importing file:", file.name);
    e.target.value = "";
  };

  const handleExport = (format: "csv" | "json" | "xlsx") => {
    // TODO: handle export logic per format
    console.log("Exporting as:", format);
    setExportOpen(false);
  };

  const VIEW_TABS: { key: ListView; icon: string; label: string }[] = [
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
                onClick={() => navigate(`/${workspace?.id}/spaces`)}
                className="text-[0.6875rem] font-medium text-on-surface-variant uppercase tracking-widest hover:text-primary transition-colors"
              >
                Spaces
              </button>
              <span className="material-symbols-outlined text-[0.6875rem] text-outline">
                chevron_right
              </span>
              <button
                onClick={() =>
                  navigate(`/${workspace?.id}/spaces/${category?.spaceId}`)
                }
                className="text-[0.6875rem] font-medium text-on-surface-variant uppercase tracking-widest hover:text-primary transition-colors"
              >
                {space?.name || "Space Name"}
              </button>
              <span className="material-symbols-outlined text-[0.6875rem] text-outline">
                chevron_right
              </span>
              <button className="text-[0.6875rem] font-medium text-on-surface-variant uppercase tracking-widest hover:text-primary transition-colors">
                {category?.name || "Category Name"}
              </button>
            </nav>
            <h2 className="text-[1.5rem] font-extrabold text-on-surface tracking-tight">
              {list?.name || "List Name"}
            </h2>
            <p className="text-on-surface-variant mt-1">
              {list?.description || "No description provided."}
            </p>
          </div>

          <div className="flex items-center gap-2">
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
            {/* ── Import button ── */}
            <input
              ref={importRef}
              type="file"
              accept=".csv,.json,.xlsx"
              className="hidden"
              onChange={handleImport}
            />
            <button
              onClick={() => importRef.current?.click()}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border border-stone-200 text-stone-600 hover:bg-stone-50 hover:border-stone-300 transition-all"
            >
              <svg
                viewBox="0 0 16 16"
                className="w-3.5 h-3.5"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M8 2v8M4 7l4 4 4-4" />
                <path d="M2 12v1a1 1 0 001 1h10a1 1 0 001-1v-1" />
              </svg>
              Import
            </button>

            {/* ── Export dropdown ── */}
            <div ref={exportRef} className="relative">
              <button
                onClick={() => setExportOpen((prev) => !prev)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border border-stone-200 text-stone-600 hover:bg-stone-50 hover:border-stone-300 transition-all"
              >
                <svg
                  viewBox="0 0 16 16"
                  className="w-3.5 h-3.5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M8 10V2M4 5l4-4 4 4" />
                  <path d="M2 12v1a1 1 0 001 1h10a1 1 0 001-1v-1" />
                </svg>
                Export
                <svg
                  viewBox="0 0 16 16"
                  className={`w-3 h-3 transition-transform ${exportOpen ? "rotate-180" : ""}`}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M4 6l4 4 4-4" />
                </svg>
              </button>

              {exportOpen && (
                <div className="absolute right-0 mt-1.5 w-40 bg-white border border-stone-200 rounded-xl shadow-lg shadow-stone-100 overflow-hidden z-20">
                  <div className="px-3 py-2 border-b border-stone-100">
                    <p className="text-[11px] font-semibold text-stone-400 uppercase tracking-wider">
                      Export as
                    </p>
                  </div>
                  {(
                    [
                      { format: "csv", label: "CSV", ext: ".csv" },
                      { format: "xlsx", label: "Excel", ext: ".xlsx" },
                      { format: "json", label: "JSON", ext: ".json" },
                    ] as const
                  ).map(({ format, label, ext }) => (
                    <button
                      key={format}
                      onClick={() => handleExport(format)}
                      className="flex items-center justify-between w-full px-3 py-2 text-[13px] font-medium text-stone-600 hover:bg-stone-50 transition-colors"
                    >
                      <span>{label}</span>
                      <span className="text-[11px] text-stone-400 font-mono">
                        {ext}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {view === "list" && <ListView />}
        {view === "kanban" && <KanbanBoard />}
        {view === "calendar" && <CalendarView />}

        {view === "list" && selectedTask && (
          <DetailTask
            task={selectedTask}
            onClose={() => setSelectedTask(null)}
          />
        )}
      </div>
    </main>
  );
};

export default ListDetail;
