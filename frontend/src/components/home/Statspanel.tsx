import { Activity } from "lucide-react";
import { Activity as ActivityType } from "../../types/activity";
import { Task, TaskSummary } from "../../types/task";
import TaskCompletionChart from "./TaskCompletionChart";
import PriorityChart from "./PriorityChart";
import WeeklyTasksChart from "./WeeklyTaskSchart";

function timeAgo(date: string | Date) {
  const diff = Date.now() - new Date(date).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

interface Props {
  summary: TaskSummary | null;
  tasks: Task[];
  activities: ActivityType[];
}

const StatsPanel: React.FC<Props> = ({ summary, tasks, activities }) => {
  return (
    <div className="space-y-4 mt-9">
      <section className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <Activity className="text-indigo-600 w-4 h-4" />
          <h2 className="text-sm font-bold text-slate-900">Recent Activity</h2>
        </div>
        {activities.length === 0 ? (
          <p className="text-slate-400 text-xs text-center py-4">
            No recent activity.
          </p>
        ) : (
          <div className="space-y-3">
            {activities.map((act) => (
              <div key={act.id} className="flex gap-2.5">
                <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 mt-1.5 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-[12px] text-slate-700 leading-snug">
                    {act.action}
                  </p>
                  <p className="text-[10px] text-slate-400 mt-0.5">
                    {timeAgo(act.createdAt)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
      <TaskCompletionChart
        completed={summary?.completed ?? 0}
        total={summary?.total ?? 0}
      />

      <WeeklyTasksChart tasks={tasks} />

      <PriorityChart tasks={tasks} />
    </div>
  );
};

export default StatsPanel;
