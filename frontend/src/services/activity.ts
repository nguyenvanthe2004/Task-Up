import instance from "./req";

export const callGetActivities = async (taskId?: number, spaceId?: number) => {
  return await instance.get("/activities", {
    params: {
      ...(taskId !== undefined ? { taskId } : {}),
      ...(spaceId !== undefined ? { spaceId } : {}),
    },
  });
};

export const callGetRecentActivities = async () => {
  return await instance.get("/activities/recent");
};

export const callGetActivityById = async (id: number) => {
  return await instance.get(`/activities/${id}`);

};