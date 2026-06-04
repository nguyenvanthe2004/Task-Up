import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { isAdminRole } from "../lib/auth";
import AdminLayout from "../layouts/AdminLayout";

const AdminRoute: React.FC = () => {
  const user = useSelector((state: RootState) => state.auth.currentUser);

  if (!user?.id) {
    return <Navigate to="/landing" replace />;
  }

  if (!isAdminRole(user.role)) {
    return <Navigate to="/" replace />;
  }

  return <AdminLayout />;
};

export default AdminRoute;
