import React, { useEffect, useState } from "react";
import { View } from "../../types/task";
import { Space } from "../../types/space";
import PageHeader from "./PageHeader";
import MyTaskListView from "./MyTaskListView";
import MyTaskBoardView from "./MyTaskBoardView";
import MyTaskCalendarView from "./MyTaskCalendarView";
import FilterSortBar, { DEFAULT_FILTERS, FilterState } from "./FilterSortBar";
import { useSearchParams, useParams } from "react-router-dom";
import { callGetSpaces } from "../../services/space";

const MyTask: React.FC = () => {
  const [searchParams] = useSearchParams();
  const { workspaceId } = useParams();
  const modeView = searchParams.get("mode");
  const [view, setView] = useState<View>("list");
  const [spaces, setSpaces] = useState<Space[]>([]);
  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS);

  useEffect(() => {
    !modeView ? setView("list") : setView(modeView as View);
  }, [modeView]);

  useEffect(() => {
    callGetSpaces(workspaceId ? Number(workspaceId) : undefined)
      .then((res) => setSpaces(res.data ?? []))
      .catch(() => {});
  }, [workspaceId]);

  return (
    <main className="ml-0 lg:ml-64 mt-[55px] min-h-screen p-4 sm:p-6 lg:p-8">
      <PageHeader view={view} />
      <FilterSortBar spaces={spaces} filters={filters} onChange={setFilters} />

      {view === "list" && <MyTaskListView filters={filters} />}
      {view === "kanban" && <MyTaskBoardView filters={filters} />}
      {view === "calendar" && <MyTaskCalendarView filters={filters} />}
    </main>
  );
};

export default MyTask;
