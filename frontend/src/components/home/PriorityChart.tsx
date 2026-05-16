import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
} from "chart.js";
import { Task } from "../../types/task";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip);

interface Props {
  tasks: Task[];
}

const PRIORITY_ORDER = ["urgent", "high", "normal", "low"];
const PRIORITY_COLORS: Record<string, string> = {
  urgent: "#ef4444",
  high: "#f97316",
  normal: "#eab308",
  low: "#94a3b8",
};

const PriorityChart: React.FC<Props> = ({ tasks }) => {
  const counts = PRIORITY_ORDER.map((p) =>
    tasks.filter((t) => t.priority === p).length
  );

  const data = {
    labels: PRIORITY_ORDER.map((p) => p.charAt(0).toUpperCase() + p.slice(1)),
    datasets: [
      {
        data: counts,
        backgroundColor: PRIORITY_ORDER.map((p) => PRIORITY_COLORS[p]),
        borderRadius: 4,
        borderSkipped: false,
        barThickness: 14,
      },
    ],
  };

  const options = {
    indexAxis: "y" as const,
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (ctx: any) => ` ${ctx.raw} tasks`,
        },
      },
    },
    scales: {
      x: {
        grid: { color: "#f1f5f9" },
        ticks: {
          stepSize: 1,
          font: { size: 10 },
          color: "#94a3b8",
        },
        beginAtZero: true,
      },
      y: {
        grid: { display: false },
        ticks: { font: { size: 10 }, color: "#64748b" },
      },
    },
  };

  return (
    <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
      <h4 className="text-xs font-bold text-slate-900 mb-3">
        Priority Breakdown
      </h4>
      <div style={{ height: 100 }}>
        <Bar data={data} options={options} />
      </div>
    </div>
  );
};

export default PriorityChart;