import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Space } from "../../types/space";
import { Task } from "../../types/task";
import { LayoutGrid } from "lucide-react";

interface Props {
  spaces: Space[];
  tasks: Task[];
}

const DONE_KEYWORDS = ["done", "complete", "completed", "closed", "finish", "finished"];
const isDone = (t: Task) => {
  const name = (t.status as any)?.name?.toLowerCase() ?? "";
  return DONE_KEYWORDS.some((kw) => name.includes(kw));
};

const SpaceProgress: React.FC<Props> = ({ spaces, tasks }) => {
  const navigate = useNavigate();
  const { workspaceId } = useParams();

  const rows = spaces.map((space) => {
    const spaceTasks = tasks.filter(
      (t) => t.list?.category?.space?.id === space.id,
    );
    const completed = spaceTasks.filter(isDone).length;
    const total = spaceTasks.length;
    const pct = total === 0 ? 0 : Math.round((completed / total) * 100);
    return { space, completed, total, pct };
  });

  return (
    <section className="bg-white p-5 sm:p-6 rounded-xl border border-slate-100 shadow-sm">
      <div className="flex items-center gap-2 mb-5">
        <LayoutGrid className="text-indigo-600 w-4 h-4" />
        <h2 className="text-sm font-bold text-slate-900">Space Progress</h2>
        <span className="bg-indigo-50 text-indigo-600 text-[10px] font-bold px-1.5 py-0.5 rounded-full">
          {spaces.length}
        </span>
      </div>

      {rows.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <LayoutGrid className="w-8 h-8 text-slate-200 mb-2" />
          <p className="text-sm font-semibold text-slate-500 mb-1">No spaces yet</p>
          <p className="text-xs text-slate-400">Space progress will appear here once you join a space.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {rows.map(({ space, completed, total, pct }) => (
            <div
              key={space.id}
              onClick={() => navigate(`/${workspaceId}/spaces/${space.id}`)}
              className="cursor-pointer group"
            >
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-2 min-w-0">
                  {space.icon && space.icon.length <= 2 ? (
                    <span className="text-base leading-none">{space.icon}</span>
                  ) : (
                    <span
                      className="w-3 h-3 rounded-full flex-shrink-0"
                      style={{ backgroundColor: space.color || "#6366f1" }}
                    />
                  )}
                  <span className="text-[13px] font-semibold text-slate-700 group-hover:text-indigo-600 transition-colors truncate">
                    {space.name}
                  </span>
                </div>
                <span className="text-[11px] font-bold text-slate-400 flex-shrink-0 ml-2">
                  {completed}/{total}
                </span>
              </div>
              <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${pct}%`,
                    backgroundColor: pct === 100 ? "#22c55e" : space.color || "#6366f1",
                  }}
                />
              </div>
              <p className="text-[10px] text-slate-400 mt-1">{pct}% completed</p>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default SpaceProgress;
