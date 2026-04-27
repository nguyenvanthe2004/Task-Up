import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { Task } from "../types/task";

const formatTasks = (tasks: Task[]) => {
  return tasks.map((t) => ({
    ID: t.id,
    Name: t.name,
    Description: t.description || "",
    Priority: t.priority || "",
    Status: t.status?.[0]?.name || t.statusId,
    Tag: t.tag || "",
    StartDate: t.startDate || "",
    DueDate: t.dueDate || "",

    Assignees:
      t.assignees?.map((a) => a.fullName).join(", ") || "",

    List: t.list?.name || "",
    Category: t.list?.category?.name || "",
    Space: t.list?.category?.space?.name || "",

    CreatedAt: t.createdAt || "",
    UpdatedAt: t.updatedAt || "",
  }));
};

export const exportJSON = (
  tasks: Task[],
  filename = "tasks.json"
) => {
  const blob = new Blob([JSON.stringify(tasks, null, 2)], {
    type: "application/json",
  });

  saveAs(blob, filename);
};

export const exportCSV = (
  tasks: Task[],
  filename = "tasks.csv"
) => {
  const data = formatTasks(tasks);

  const worksheet = XLSX.utils.json_to_sheet(data);
  const csv = XLSX.utils.sheet_to_csv(worksheet);

  const blob = new Blob([csv], {
    type: "text/csv;charset=utf-8;",
  });

  saveAs(blob, filename);
};

export const exportExcel = (
  tasks: Task[],
  filename = "tasks.xlsx"
) => {
  const data = formatTasks(tasks);

  const worksheet = XLSX.utils.json_to_sheet(data);

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Tasks");

  const buffer = XLSX.write(workbook, {
    bookType: "xlsx",
    type: "array",
  });

  const blob = new Blob([buffer], {
    type: "application/octet-stream",
  });

  saveAs(blob, filename);
};