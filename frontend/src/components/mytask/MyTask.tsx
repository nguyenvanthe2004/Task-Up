import React, { useState } from "react";
import { View } from "../../types/task";
import PageHeader from "./PageHeader";
import MyTaskListView from "./MyTaskListView";


const MyTask: React.FC = () => {
  const [view, setView] = useState<View>("list");

  return (
    <main className="ml-0 lg:ml-64 mt-[55px] min-h-screen p-4 sm:p-6 lg:p-8">
      <PageHeader view={view} setView={setView} />

      {view === "list" && <MyTaskListView />}

    </main>
  );
};

export default MyTask;


      // {view === "calendar" && <CalendarView />}
      // {view === "kanban" && <KanbanBoard />}