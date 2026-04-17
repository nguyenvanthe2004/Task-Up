import User from "./User";
import Workspace from "./Workspace";
import UserWorkspace from "./UserWorkspace";

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
};

export { User, Workspace, UserWorkspace };
export default initModels;
