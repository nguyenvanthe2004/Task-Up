import { Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

interface Props {
  completed: number;
  total: number;
}

const TaskCompletionChart: React.FC<Props> = ({ completed, total }) => {
  const remaining = Math.max(total - completed, 0);
  const percent = total > 0 ? Math.round((completed / total) * 100) : 0;

  const data = {
    labels: ["Completed", "Remaining"],
    datasets: [
      {
        data: total === 0 ? [0, 1] : [completed, remaining],
        backgroundColor: ["#6366f1", "#e0e7ff"],
        borderColor: ["#6366f1", "#e0e7ff"],
        borderWidth: 0,
        hoverOffset: 4,
      },
    ],
  };

  const options = {
    cutout: "72%",
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (ctx: any) => ` ${ctx.label}: ${ctx.raw}`,
        },
      },
    },
  };

  return (
    <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
      <h4 className="text-xs font-bold text-slate-900 mb-3">Completion Rate</h4>
      <div className="relative flex items-center justify-center" style={{ height: 120 }}>
        <Doughnut data={data} options={options} />
        <div className="absolute flex flex-col items-center pointer-events-none">
          <span className="text-2xl font-bold text-slate-900">{percent}%</span>
          <span className="text-[10px] text-slate-400">done</span>
        </div>
      </div>
      <div className="flex justify-around mt-3">
        <div className="text-center">
          <p className="text-[10px] text-slate-400">Completed</p>
          <p className="text-sm font-bold text-indigo-600">{completed}</p>
        </div>
        <div className="text-center">
          <p className="text-[10px] text-slate-400">Remaining</p>
          <p className="text-sm font-bold text-slate-500">{remaining}</p>
        </div>
      </div>
    </div>
  );
};

export default TaskCompletionChart;