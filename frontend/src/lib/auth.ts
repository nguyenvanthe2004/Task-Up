import { UserRole } from "../constants";
import type { User } from "../types/auth";
import type { Workspace } from "../types/workspace";

export const isAdminRole = (role?: string | null): boolean =>
  (role ?? "").toLowerCase() === UserRole.ADMIN;

export const normalizeAuthUser = (
  payload: unknown,
): User & {
  workspaces?: Workspace[];
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
} => {
  const raw =
    payload && typeof payload === "object" && "user" in payload
      ? (payload as { user: unknown }).user
      : payload;

  const obj =
    raw && typeof raw === "object"
      ? {
          ...((raw as { dataValues?: Record<string, unknown> }).dataValues ??
            {}),
          ...(raw as Record<string, unknown>),
        }
      : {};

  return {
    id: Number(obj.id) || 0,
    fullName: String(obj.fullName ?? ""),
    email: String(obj.email ?? ""),
    phone: String(obj.phone ?? ""),
    role: String(obj.role ?? "").toLowerCase(),
    avatar: String(obj.avatar ?? ""),
    workspaces: Array.isArray(obj.workspaces)
      ? (obj.workspaces as Workspace[])
      : [],
    ...(obj.isActive !== undefined && { isActive: Boolean(obj.isActive) }),
    ...(obj.createdAt != null && { createdAt: String(obj.createdAt) }),
    ...(obj.updatedAt != null && { updatedAt: String(obj.updatedAt) }),
  };
};

export const getPostLoginPath = (
  user: User & { workspaces?: Workspace[] },
): string => {
  if (isAdminRole(user.role)) return "/admin";
  const workspaces = user.workspaces ?? [];
  if (workspaces.length > 0) return `/${workspaces[0].id}`;
  return "/";
};
