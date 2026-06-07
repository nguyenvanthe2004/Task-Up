import instance from "./req";

export const callGetNotifications = async (workspaceId?: number, isRead?: boolean) => {
  return await instance.get("/notifications", {
    params: {
      ...(workspaceId !== undefined && { workspaceId }),
      ...(isRead !== undefined && { isRead }),
    },
  });
};

export const callGetUnreadCount = async (workspaceId?: number) => {
  return await instance.get("/notifications/unread-count", {
    params: workspaceId !== undefined ? { workspaceId } : {},
  });
};

export const callGetNotificationById = async (id: number) => {
  return await instance.get(`/notifications/${id}`);
};

export const callMarkAsRead = async (id: number) => {
  return await instance.patch(`/notifications/${id}/read`);
};

export const callMarkAllAsRead = async () => {
  return await instance.patch("/notifications/mark-all-read");
};
export const callGetLatestNotifications = async (
  workspaceId: number,
  isRead?: boolean,
) => {
  return await instance.get("/notifications/latest", {
    params: {
      workspaceId,
      ...(isRead !== undefined && { isRead }),
    },
  });
};
