import { BrowserRouter, Route, Routes } from "react-router-dom";
import LandingPage from "./pages/landing/LandingPage";
import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";
import { useEffect } from "react";
import { callGetCurrentUser } from "./services/auth";
import { setCurrentUser } from "./redux/slices/currentUser";
import { useDispatch } from "react-redux";

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
      </Routes>
    </BrowserRouter>
  );
}

export default App;
