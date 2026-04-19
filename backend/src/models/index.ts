import User from "./User";
import Workspace from "./Workspace";
import UserWorkspace from "./UserWorkspace";
import Space from "./Space";
import UserSpace from "./UserSpace";

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
};

export { User, Workspace, UserWorkspace, Space, UserSpace };
export default initModels;
