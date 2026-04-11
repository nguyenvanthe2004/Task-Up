export type Task = {
  _id: string;
  name: string;
  assignee: string;
  avatar: string;
  dueDate: string;
  priority: "Low" | "Medium" | "High";
  status: "Active" | "Review" | "Waiting" | "Backlog";
};

export interface DetailTaskProps {
  task: Task;
  onClose: () => void;
}

export interface KanbanColumn {
  id: string;
  title: string;
  color: string;
  tasks: Task[];
}

export type View = "list" | "calendar" | "kanban";

export interface CalendarTask extends Task {
  day: number;
  duration?: string;
  category?: string;
}

export interface TaskGroup {
  id: string;
  title: string;
  tasks: Task[];
}