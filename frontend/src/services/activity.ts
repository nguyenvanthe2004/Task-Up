import instance from "./req";

export const callGetActivities = async (taskId?: number) => {
  return await instance.get("/activities", {
    params: taskId !== undefined ? { taskId } : {},
  });
};

export const callGetRecentActivities = async () => {
  return await instance.get("/activities/recent");
};

export const callGetActivityById = async (id: number) => {
  return await instance.get(`/activities/${id}`);

};