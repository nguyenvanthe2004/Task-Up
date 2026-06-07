import {
  Navigate,
  Route,
  Routes,
  useLocation,
  useNavigate,
} from "react-router-dom";
import LandingPage from "./pages/landing/LandingPage";
import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";
import { useEffect, useState } from "react";
import { callGetCurrentUser } from "./services/auth";
import { logout, setCurrentUser, setLoggingOut } from "./redux/slices/currentUser";
import { useDispatch, useSelector } from "react-redux";
import GithubCallback from "./components/auth/GitHubCallBack";
import HomePage from "./pages/home/HomePage";
import MyTaskPage from "./pages/tasks/MyTaskPage";
import MySpacePage from "./pages/spaces/MySpacePage";
import ProfilePage from "./pages/profile/ProfilePage";
import SpaceOverviewPage from "./pages/spaces/SpaceOverviewPage";
import NotificationPage from "./pages/notifications/NotificationPage";
import SpaceMemberPage from "./pages/spaces/SpaceMemberPage";
import MemberPage from "./pages/workspace/MemberPage";
import LoadingPage from "./components/ui/LoadingPage";
import PrivateRoute from "./components/PrivateRoute";
import AdminRoute from "./components/AdminRoute";
import WorkspaceRoute from "./components/WorkspaceRoute";
import UserManager from "./components/admin/users/UserManager";
import ListDetailPage from "./pages/lists/ListDetailPage";
import { RootState } from "./redux/store";
import { isAdminRole, normalizeAuthUser } from "./lib/auth";

function App() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const currentUser = useSelector((state: RootState) => state.auth.currentUser);
  const isLoggingOut = useSelector((state: RootState) => state.auth.isLoggingOut);
  const isAuthenticated = Boolean(currentUser?.id);

  const fetchCurrentUser = async () => {
    try {
      const res = await callGetCurrentUser();
      dispatch(setCurrentUser(normalizeAuthUser(res.data)));
    } catch {
      dispatch(logout());

      const publicPaths = ["/login", "/register", "/landing"];
      const isPublicPath = publicPaths.some((p) =>
        window.location.pathname.startsWith(p),
      );
      const isOAuthCallback = window.location.pathname.startsWith("/oauth/");

      if (!isPublicPath && !isOAuthCallback) {
        navigate("/login");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const publicPaths = ["/landing", "/login", "/register"];
    const isPublicPath = publicPaths.some((p) =>
      window.location.pathname.startsWith(p),
    );
    const isOAuthCallback = window.location.pathname.startsWith("/oauth/");

    if (isPublicPath || isOAuthCallback) {
      setLoading(false);
      return;
    }

    fetchCurrentUser();
  }, [dispatch]);

  useEffect(() => {
    if (loading || !currentUser?.id) return;
    if (isAdminRole(currentUser.role) && location.pathname === "/") {
      navigate("/admin", { replace: true });
    }
  }, [loading, currentUser?.id, currentUser?.role, location.pathname, navigate]);

  if (loading) return <LoadingPage />;

  return (
    <Routes>
      <Route path="/landing" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/oauth/github" element={<GithubCallback />} />

      <Route path="/admin" element={<AdminRoute />}>
        <Route index element={<UserManager />} />
      </Route>

      <Route
        path="/"
        element={
          isAuthenticated ? (
            <PrivateRoute isAuthenticated={isAuthenticated} />
          ) : isLoggingOut ? (
            <Navigate to="/login" replace />
          ) : (
            <Navigate to="/landing" replace />
          )
        }
      >
        <Route index element={<HomePage />} />
        <Route path=":workspaceId" element={<WorkspaceRoute />}>
          <Route index element={<HomePage />} />
          <Route path="members" element={<MemberPage />} />
          <Route path="my-tasks" element={<MyTaskPage />} />
          <Route path="spaces">
            <Route index element={<MySpacePage />} />
            <Route path=":spaceId">
              <Route index element={<SpaceOverviewPage />} />
              <Route path="members" element={<SpaceMemberPage />} />
              <Route path=":categoryId/:listId" element={<ListDetailPage />} />
            </Route>
          </Route>

          <Route path="settings" element={<ProfilePage />} />
          <Route path="notifications" element={<NotificationPage />} />
        </Route>
      </Route>
    </Routes>
  );
}

export default App;