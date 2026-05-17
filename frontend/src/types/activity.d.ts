export interface Activity {
  id: number;
  action: string;
  task: {
    name: string;
    list: {
      id: number;
      name: string;
      category: {
        id: number;
        name: string;
        space: {
          id: number;
          name: string;
          workspace: {
            id: number;
            name: string;
          }
        };
      };
    };
  };
  taskId: number;
  userId: number;
  createdAt: Date;
}
