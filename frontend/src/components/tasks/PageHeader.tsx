import {
  CalendarDays,
  Kanban,
  List,
  ListFilter,
  TextAlignStart,
} from "lucide-react";
import { Button } from "../ui/Button";
import { View } from "../../types/task";

const PageHeader: React.FC<{ view: View; setView: (v: View) => void }> = ({
  view,
  setView,
}) => (
  <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
    <div className="flex flex-wrap items-center gap-2 text-sm">
      <span className="text-stone-400">Marketing</span>
      <span className="material-symbols-outlined text-[16px] text-stone-300">
        chevron_right
      </span>
      <span className="text-stone-400">Q4 Campaign</span>
      <span className="material-symbols-outlined text-[16px] text-stone-300">
        chevron_right
      </span>
      <span className="font-semibold text-stone-700">Content Calendar</span>

      <div className="ml-0 flex gap-1 sm:ml-3">
        <Button
          icon={<List size={14} />}
          label="List"
          active={view === "list"}
          variant="indigo"
          onClick={() => setView("list")}
        />
        <Button
          icon={<CalendarDays size={14} />}
          label="Calendar"
          active={view === "calendar"}
          variant="indigo"
          onClick={() => setView("calendar")}
        />
        <Button
          icon={<Kanban size={14} />}
          label="Kanban"
          active={view === "kanban"}
          variant="indigo"
          onClick={() => setView("kanban")}
        />
      </div>
    </div>

    <div className="flex flex-wrap items-center justify-between gap-3 lg:w-auto lg:justify-end">
      <div className="flex -space-x-2">
        <img
          className="h-7 w-7 rounded-full border-2 border-white object-cover"
          src="https://i.pravatar.cc/100?img=1"
          alt="member"
        />
        <img
          className="h-7 w-7 rounded-full border-2 border-white object-cover"
          src="https://i.pravatar.cc/100?img=2"
          alt="member"
        />
        <div className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-white bg-stone-200 text-[10px] font-bold text-stone-600">
          +3
        </div>
      </div>

      <div className="flex gap-2">
        <Button icon={<ListFilter size={14} />} label="Filter" variant="indigo" />
        <Button icon={<TextAlignStart size={14} />} label="Sort" variant="indigo" />
      </div>
    </div>
  </div>
);

export default PageHeader;
