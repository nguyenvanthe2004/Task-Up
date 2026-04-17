// components/auth/PrivateRoute.tsx
import { Navigate, Outlet } from "react-router-dom";

interface Props {
  isAuthenticated: boolean;
}

const PrivateRoute: React.FC<Props> = ({ isAuthenticated }) => {
  return isAuthenticated ? <Outlet /> : <Navigate to="/landing" replace />;
};

export default PrivateRoute;