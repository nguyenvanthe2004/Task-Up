import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Task } from "../../types/task";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

interface Props {
  tasks: Task[];
}

function getWeekLabel(offsetDays: number): string {
  const d = new Date();
  d.setDate(d.getDate() - offsetDays);
  return d.toLocaleDateString("en-US", { weekday: "short" });
}

function getDayKey(date: Date): string {
  return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
}

const WeeklyTasksChart: React.FC<Props> = ({ tasks }) => {
  const days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    return d;
  });

  const completedByDay = days.map((day) => {
    const key = getDayKey(day);
    return tasks.filter((t) => {
      if (!t.updatedAt) return false;
      const td = new Date(t.updatedAt);
      return (
        getDayKey(td) === key &&
        (t.status as any)?.name?.toLowerCase() === "completed"
      );
    }).length;
  });

  const createdByDay = days.map((day) => {
    const key = getDayKey(day);
    return tasks.filter((t) => {
      if (!t.createdAt) return false;
      return getDayKey(new Date(t.createdAt)) === key;
    }).length;
  });

  const labels = days.map((_, i) => getWeekLabel(6 - i));

  const data = {
    labels,
    datasets: [
      {
        label: "Created",
        data: createdByDay,
        backgroundColor: "#c7d2fe",
        borderRadius: 4,
        borderSkipped: false,
      },
      {
        label: "Completed",
        data: completedByDay,
        backgroundColor: "#6366f1",
        borderRadius: 4,
        borderSkipped: false,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: "bottom" as const,
        labels: {
          boxWidth: 10,
          font: { size: 10 },
          color: "#94a3b8",
        },
      },
      tooltip: { mode: "index" as const, intersect: false },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { font: { size: 10 }, color: "#94a3b8" },
      },
      y: {
        grid: { color: "#f1f5f9" },
        ticks: {
          stepSize: 1,
          font: { size: 10 },
          color: "#94a3b8",
        },
        beginAtZero: true,
      },
    },
  };

  return (
    <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
      <h4 className="text-xs font-bold text-slate-900 mb-3">Weekly Tasks</h4>
      <div style={{ height: 130 }}>
        <Bar data={data} options={options} />
      </div>
    </div>
  );
};

export default WeeklyTasksChart;