import { Dayjs } from "dayjs";
import { WEEKDAYS } from "../../constants";
import { buildCells } from "../../lib/until";

const MiniMonth: React.FC<{ d: Dayjs }> = ({ d }) => (
  <div>
    <h3 className="text-[10px] font-bold tracking-[0.15em] text-stone-400 uppercase mb-3">
      {d.format("MMMM YYYY")}
    </h3>
    <div className="grid grid-cols-7 gap-y-1.5 text-center">
      {WEEKDAYS.map((w) => (
        <div key={w} className="text-[8px] font-bold text-stone-400">
          {w[0]}
        </div>
      ))}
      {buildCells(d).map((c, i) => (
        <div
          key={i}
          className={`text-[10px] font-medium leading-none py-0.5 rounded-full w-5 h-5 flex items-center justify-center mx-auto transition-colors ${!c.cur ? "text-stone-300" : "text-stone-600 hover:bg-stone-100 cursor-pointer"}`}
        >
          {c.day}
        </div>
      ))}
    </div>
  </div>
);

export default MiniMonth;
