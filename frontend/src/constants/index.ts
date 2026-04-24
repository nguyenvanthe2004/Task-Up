export const BASE_URL = import.meta.env.VITE_BACKEND_URL;
export const CLOUDINARY_URL = import.meta.env.VITE_CLOUDINARY_URL;
export const YOUR_GOOGLE_CLIENT_ID = import.meta.env.VITE_YOUR_GOOGLE_CLIENT_ID;
export const YOUR_GITHUB_CLIENT_ID = import.meta.env.VITE_YOUR_GITHUB_CLIENT_ID;

export enum UserRole {
  USER = "user",
  ADMIN = "admin",
}

export enum WorkspaceRole {
  OWNER = "owner",
  MEMBER = "member",
}

export enum PriorityStatus {
  LOW = "low",
  NORMAL = "normal",
  HIGH = "high",
  URGENT = "urgent",
}

export const priorityBadge: Record<string, string> = {
  High: "bg-red-50 text-red-700",
  Medium: "bg-amber-50 text-amber-700",
  Low: "bg-emerald-50 text-emerald-700",
};

export const statusBadge: Record<string, string> = {
  Active: "bg-indigo-50 text-indigo-600",
  Review: "bg-violet-50 text-violet-600",
  Waiting: "bg-amber-50 text-amber-600",
  Done: "bg-emerald-50 text-emerald-600",
};

export const priorityMap: Record<string, { dot: string; text: string; bg: string }> = {
  High:   { dot: "bg-red-500",     text: "text-red-700",     bg: "bg-red-50"     },
  Medium: { dot: "bg-amber-500",   text: "text-amber-700",   bg: "bg-amber-50"   },
  Low:    { dot: "bg-emerald-500", text: "text-emerald-700", bg: "bg-emerald-50" },
};

export const statusMap: Record<string, { icon: string; text: string; bg: string; border: string }> = {
  Active:  { icon: "pending",         text: "text-blue-700",   bg: "bg-blue-50",   border: "border-blue-200"   },
  Review:  { icon: "rate_review",     text: "text-violet-700", bg: "bg-violet-50", border: "border-violet-200" },
  Waiting: { icon: "hourglass_empty", text: "text-amber-700",  bg: "bg-amber-50",  border: "border-amber-200"  },
  Done:    { icon: "task_alt",        text: "text-emerald-700",bg: "bg-emerald-50",border: "border-emerald-200"},
};

export const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];




