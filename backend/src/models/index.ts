import User from "./User";
import Workspace from "./Workspace";
import UserWorkspace from "./UserWorkspace";
import Space from "./Space";
import UserSpace from "./UserSpace";
import Category from "./Category";
import List from "./List";
import Task from "./Task";
import Status from "./Status";
import TaskAssignee from "./TaskAssignee";

const initModels = () => {
  User.belongsToMany(Workspace, {
    through: UserWorkspace,
    foreignKey: "userId",
    otherKey: "workspaceId",
    as: "workspaces",
  });

  Workspace.belongsToMany(User, {
    through: UserWorkspace,
    foreignKey: "workspaceId",
    otherKey: "userId",
    as: "users",
  });
  Workspace.hasMany(UserWorkspace, {
    foreignKey: "workspaceId",
    as: "userWorkspaces",
  });

  UserWorkspace.belongsTo(Workspace, {
    foreignKey: "workspaceId",
    as: "workspace",
  });

  UserWorkspace.belongsTo(User, {
    foreignKey: "userId",
    as: "user",
  });
  UserWorkspace.belongsTo(User, {
    foreignKey: "invitedBy",
    as: "inviter",
  });

  Workspace.belongsTo(User, {
    foreignKey: "ownerId",
    as: "owner",
  });

  User.hasMany(Workspace, {
    foreignKey: "ownerId",
    as: "ownedWorkspaces",
  });

  Workspace.hasMany(Space, {
    foreignKey: "workspaceId",
    as: "spaces",
  });

  Space.belongsTo(Workspace, {
    foreignKey: "workspaceId",
    as: "workspace",
  });
  Space.belongsToMany(User, {
    through: UserSpace,
    foreignKey: "spaceId",
    otherKey: "userId",
    as: "members",
  });

  User.belongsToMany(Space, {
    through: UserSpace,
    foreignKey: "userId",
    otherKey: "spaceId",
    as: "spaces",
  });

  Space.hasMany(UserSpace, {
    foreignKey: "spaceId",
    as: "userSpaces",
  });

  UserSpace.belongsTo(Space, {
    foreignKey: "spaceId",
    as: "space",
  });

  UserSpace.belongsTo(User, {
    foreignKey: "userId",
    as: "user",
  });

  Space.hasMany(Category, {
    foreignKey: "spaceId",
    as: "categories",
  });

  Category.belongsTo(Space, {
    foreignKey: "spaceId",
    as: "space",
  });

  Category.hasMany(List, {
    foreignKey: "categoryId",
    as: "lists",
  });

  List.belongsTo(Category, {
    foreignKey: "categoryId",
    as: "category",
  });

  List.hasMany(Task, {
    foreignKey: "listId",
    as: "tasks",
  });

  Task.belongsTo(List, {
    foreignKey: "listId",
    as: "list",
  });

  Status.hasMany(Task, {
    foreignKey: "statusId",
    as: "tasks",
  });

  Task.belongsTo(Status, {
    foreignKey: "statusId",
    as: "status",
  });

  Task.belongsToMany(User, {
    through: TaskAssignee,
    foreignKey: "taskId",
    otherKey: "userId",
    as: "assignees",
  });

  User.belongsToMany(Task, {
    through: TaskAssignee,
    foreignKey: "userId",
    otherKey: "taskId",
    as: "tasks",
  });

  Task.hasMany(TaskAssignee, {
    foreignKey: "taskId",
    as: "userTasks",
  });

  TaskAssignee.belongsTo(Task, {
    foreignKey: "taskId",
    as: "task",
  });

  TaskAssignee.belongsTo(User, {
    foreignKey: "userId",
    as: "user",
  });
};

export {
  User,
  Workspace,
  UserWorkspace,
  Space,
  UserSpace,
  Category,
  List,
  Task,
  Status,
  TaskAssignee,
};
export default initModels;
