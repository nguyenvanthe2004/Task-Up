import { ArrowRight, CalendarCheck, CheckCircle2, Clock } from "lucide-react";
import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Space } from "../../types/space";
import { Task } from "../../types/task";
import { Workspace } from "../../types/workspace";

interface Props {
  todayTasks: Task[];
  allTasks: Task[];
  dueToday?: number;
  workspaces: Workspace[];
  spaces: Space[];
}

const TaskList: React.FC<Props> = ({
  todayTasks,
  allTasks,
  dueToday,
  workspaces,
  spaces,
}) => {
  const navigate = useNavigate();
  const { workspaceId }= useParams();

  const spaceMap = new Map<string, { name: string; total: number; done: number }>();
  allTasks.forEach((t) => {
    const space = (t.list as any)?.category?.space;
    if (!space?.id) return;
    const key = String(space.id);
    const entry = spaceMap.get(key) ?? { name: space.name, total: 0, done: 0 };
    entry.total += 1;
    const statusName = (t.status as any)?.name?.toLowerCase() ?? "";
    if (statusName === "done") entry.done += 1;
    spaceMap.set(key, entry);
  });

  const spaceStats = spaces.map((sp) => {
    const existing = spaceMap.get(String(sp.id));
    return existing ?? { name: sp.name, total: 0, done: 0 };
  });

  return (
    <>
      <section className="bg-white p-5 sm:p-6 rounded-xl border border-slate-100 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <CalendarCheck className="text-indigo-600 w-4 h-4" />
            <h2 className="text-sm font-bold text-slate-900">Due Today</h2>
            {dueToday ? (
              <span className="bg-indigo-50 text-indigo-600 text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                {dueToday}
              </span>
            ) : null}
          </div>
          <button
            onClick={() => navigate(`/${workspaceId}/spaces`)}
            className="text-indigo-600 text-[11px] font-bold hover:underline flex items-center gap-1"
          >
            View All <ArrowRight className="w-3 h-3" />
          </button>
        </div>
        {todayTasks.length === 0 ? (
          <div className="text-center py-8 text-slate-400 text-sm">
            <CheckCircle2 className="w-8 h-8 mx-auto mb-2 text-green-300" />
            No tasks due today 🎉
          </div>
        ) : (
          <div className="space-y-0">
            {todayTasks.slice(0, 5).map((task, i, arr) => (
              <div key={task.id} className="flex gap-3 sm:gap-4">
                <div className="flex flex-col items-center pt-1.5 flex-shrink-0">
                  <div
                    className="w-2.5 h-2.5 rounded-full ring-4 flex-shrink-0"
                    style={{
                      backgroundColor: (task.status as any)?.color ?? "#6366f1",
                    }}
                  />
                  {i < arr.length - 1 && (
                    <div
                      className="w-px flex-1 bg-slate-100 my-1"
                      style={{ minHeight: 40 }}
                    />
                  )}
                </div>
                <div
                  className={`flex-1 pb-5 ${i < arr.length - 1 ? "border-b border-slate-50" : ""}`}
                >
                  <div className="flex flex-wrap justify-between items-start gap-1 mb-0.5">
                    <h4 className="text-sm font-bold text-slate-900 pr-2 truncate max-w-[200px]">
                      {task.name}
                    </h4>
                  </div>
                  <p className="text-[12px] text-slate-500">
                    {task.list?.name} · {task.list?.category?.space?.name}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="bg-white p-5 sm:p-6 rounded-xl border border-slate-100 shadow-sm">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <Clock className="text-indigo-600 w-4 h-4" />
            <h2 className="text-sm font-bold text-slate-900">Progress</h2>
          </div>
          <button
            onClick={() => navigate(`/${workspaces[0]?.id}`)}
            className="text-indigo-600 text-[11px] font-bold hover:underline flex items-center gap-1"
          >
            View All <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        {spaceStats.length === 0 ? (
          <p className="text-slate-400 text-sm text-center py-6">
            No tasks assigned to you yet.
          </p>
        ) : (
          <div className="space-y-4">
            {spaceStats.map((sp) => {
              const pct = sp.total > 0 ? Math.round((sp.done / sp.total) * 100) : 0;
              return (
                <div key={sp.name}>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[12px] font-semibold text-slate-700 truncate max-w-[60%]">
                      {sp.name}
                    </span>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <span className="text-[11px] font-bold text-indigo-600 w-8 text-right">
                        {pct}%
                      </span>
                    </div>
                  </div>
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-700"
                      style={{ width: `${pct}%`, background: "#6366f1" }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </>
  );
};

export default TaskList;