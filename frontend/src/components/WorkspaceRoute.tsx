import { Navigate, Outlet, useParams } from "react-router-dom";

const WorkspaceRoute: React.FC = () => {
  const { workspaceId } = useParams();

  if (workspaceId === "admin") {
    return <Navigate to="/admin" replace />;
  }

  if (!workspaceId || !/^\d+$/.test(workspaceId)) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default WorkspaceRoute;
