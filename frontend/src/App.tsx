import { BrowserRouter, Route, Routes, useNavigate } from "react-router-dom";
import LandingPage from "./pages/landing/LandingPage";
import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";
import { useEffect, useState } from "react";
import { callGetCurrentUser } from "./services/auth";
import { setCurrentUser } from "./redux/slices/currentUser";
import { useDispatch } from "react-redux";
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

function App() {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const fetchCurrentUser = async () => {
    try {
      const res = await callGetCurrentUser();
      dispatch(setCurrentUser(res.data));
      setIsAuthenticated(true);
    } catch {
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCurrentUser();
  }, [dispatch]);

  if (loading) return <LoadingPage />;

  return (
    <Routes>
      <Route path="/landing" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/oauth/github" element={<GithubCallback />} />

      <Route
        path="/"
        element={<PrivateRoute isAuthenticated={isAuthenticated} />}
      >
        <Route index element={<HomePage />} />
        <Route path=":workspaceId">
          <Route index element={<HomePage />} />
          <Route path="members" element={<MemberPage />} />
          <Route path="my-tasks" element={<MyTaskPage />} />
          <Route path="spaces">
            <Route index element={<MySpacePage />} />
            <Route path="overview" element={<SpaceOverviewPage />} />
            <Route path="members" element={<SpaceMemberPage />} />
          </Route>

          <Route path="settings" element={<ProfilePage />} />

          <Route path="notifications" element={<NotificationPage />} />
        </Route>
      </Route>
    </Routes>
  );
}

export default App;
