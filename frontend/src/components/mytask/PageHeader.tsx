import {
  CalendarDays,
  Kanban,
  List,
  ListFilter,
  TextAlignStart,
} from "lucide-react";
import { Button } from "../ui/Button";
import { View } from "../../types/task";
import { useNavigate, useParams } from "react-router-dom";
import { RootState } from "../../redux/store";
import { useSelector } from "react-redux";
import { Workspace } from "../../types/workspace";

const PageHeader: React.FC<{ view: View; }> = ({
  view,
}) => {
  const navigate = useNavigate();
  const { workspaceId } = useParams();

  const onClick = (mode: View) => {
    navigate(`/${workspaceId}/my-tasks?mode=${mode}`);
  };
  return (
    <div className="mb-6 w-50 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
      <div className="flex flex-col gap-2 text-sm">
        <h2 className="text-[1.5rem] font-extrabold text-on-surface tracking-tight">
          {"My Tasks"}
        </h2>
        <p className="text-stone-500">
          This section shows all tasks assigned to you across different spaces,
          folders, and lists.
        </p>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 lg:w-auto lg:justify-end">
        <div className="ml-0 flex gap-1 sm:ml-3">
          <Button
            icon={<List size={14} />}
            label="List"
            active={view === "list"}
            variant="indigo"
            onClick={() => onClick("list")}
          />
          <Button
            icon={<Kanban size={14} />}
            label="Kanban"
            active={view === "kanban"}
            variant="indigo"
            onClick={() => onClick("kanban")}
          />
          <Button
            icon={<CalendarDays size={14} />}
            label="Calendar"
            active={view === "calendar"}
            variant="indigo"
            onClick={() => onClick("calendar")}
          />
        </div>
        <div className="flex gap-2">
          <Button
            icon={<ListFilter size={14} />}
            label="Filter"
            variant="indigo"
          />
          <Button
            icon={<TextAlignStart size={14} />}
            label="Sort"
            variant="indigo"
          />
        </div>
      </div>
    </div>
  );
};

export default PageHeader;
