import { Navigate, Outlet, useLocation } from "react-router-dom";

interface Props {
  isAuthenticated: boolean;
}

const PrivateRoute: React.FC<Props> = ({ isAuthenticated }) => {
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/landing" replace state={{ from: location }} />;
  }

  return <Outlet />;
};

export default PrivateRoute;