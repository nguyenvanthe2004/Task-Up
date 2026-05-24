import instance from "./req";

export const callGetNotifications = async (isRead?: boolean) => {
  return await instance.get("/notifications", {
    params: isRead !== undefined ? { isRead } : {},
  });
};

export const callGetUnreadCount = async () => {
  return await instance.get("/notifications/unread-count");
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