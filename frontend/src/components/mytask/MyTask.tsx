import React, { useEffect, useState } from "react";
import { View } from "../../types/task";
import PageHeader from "./PageHeader";
import MyTaskListView from "./MyTaskListView";
import MyTaskBoardView from "./MyTaskBoardView";
import MyTaskCalendarView from "./MyTaskCalendarView";
import { useSearchParams } from "react-router-dom";


const MyTask: React.FC = () => {
  const [searchParams]= useSearchParams();
  const modeView = searchParams.get('mode'); 
  const [view, setView] = useState<View>("list");

  useEffect(() => {
    !modeView ? setView("list") : setView(modeView as View);
  }, [modeView])

  return (
    <main className="ml-0 lg:ml-64 mt-[55px] min-h-screen p-4 sm:p-6 lg:p-8">
      <PageHeader view={view}/>

      {view === "list" && <MyTaskListView />}
      {view === "kanban" && <MyTaskBoardView />}
      {view === "calendar" && <MyTaskCalendarView />}

    </main>
  );
};

export default MyTask;

