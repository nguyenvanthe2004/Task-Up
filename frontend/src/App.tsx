import { BrowserRouter, Route, Routes } from "react-router-dom";
import LandingPage from "./pages/landing/LandingPage";
import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";
import { useEffect } from "react";
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

function App() {
  const dispatch = useDispatch();
  const fetchCurrentUser = async () => {
    try {
      const res = await callGetCurrentUser();
      dispatch(setCurrentUser(res.data));
    } catch {}
  };
  useEffect(() => {
    fetchCurrentUser();
  }, [dispatch]);
  
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/oauth/github" element={<GithubCallback />} />

        <Route path="/home" element={<HomePage />} />

        <Route path="/my-tasks" element={<MyTaskPage />} />


        <Route path="/spaces">
          <Route index element={<MySpacePage />} />
          <Route path="overview" element={<SpaceOverviewPage />} />
          <Route path="members" element={<SpaceMemberPage />} />
        </Route>

        <Route path="/settings" element={<ProfilePage />} />

        <Route path="/notifications" element={<NotificationPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
