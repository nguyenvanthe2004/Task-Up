import React, { useEffect, useState } from "react";
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

type ListView = "list" | "kanban" | "calendar";

const ListDetail: React.FC = () => {
  const { listId } = useParams<{ listId: string }>();
  const [view, setView] = useState<ListView>("list");
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const navigate = useNavigate();
  const [list, setList] = useState<List | null>(null);
  const [category, setCategory] = useState<Category | null>(null);
  const [space, setSpace] = useState<Space | null>(null);

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
                onClick={() => navigate(-1)}
                className="text-[0.6875rem] font-medium text-on-surface-variant uppercase tracking-widest hover:text-primary transition-colors"
              >
                Spaces
              </button>
              <span className="material-symbols-outlined text-[0.6875rem] text-outline">
                chevron_right
              </span>
              <button
                onClick={() => navigate(-1)}
                className="text-[0.6875rem] font-medium text-on-surface-variant uppercase tracking-widest hover:text-primary transition-colors"
              >
                {space?.name || "Space Name"}
              </button>
              <span className="material-symbols-outlined text-[0.6875rem] text-outline">
                chevron_right
              </span>
              <button
                onClick={() => navigate(-1)}
                className="text-[0.6875rem] font-medium text-on-surface-variant uppercase tracking-widest hover:text-primary transition-colors"
              >
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
