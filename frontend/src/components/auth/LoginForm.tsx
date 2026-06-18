import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";

import { LoginFormData, loginSchema } from "../../validations/auth";
import { callLogin, callLoginGoogle } from "../../services/auth";
import { setCurrentUser } from "../../redux/slices/currentUser";
import { toastError, toastSuccess } from "../../lib/toast";
import { CredentialResponse, GoogleLogin } from "@react-oauth/google";
import { FRONTEND_URL, YOUR_GITHUB_CLIENT_ID } from "../../constants";
import { Eye, EyeOff } from "lucide-react";
import { getPostLoginPath, normalizeAuthUser } from "../../lib/auth";
import { callAcceptInvite } from "../../services/workspace";
import { WORKSPACE_JOINED_EVENT } from "../SideBar";
import { PENDING_INVITE_TOKEN_KEY } from "../landing/Landing";

const handlePendingInvite = async (): Promise<number | null> => {
  const token = sessionStorage.getItem(PENDING_INVITE_TOKEN_KEY);
  if (!token) return null;

  sessionStorage.removeItem(PENDING_INVITE_TOKEN_KEY);

  try {
    const res = await callAcceptInvite(token);
    const workspaceId = res.data?.workspaceId;
    window.dispatchEvent(
      new CustomEvent(WORKSPACE_JOINED_EVENT, { detail: { workspaceId } }),
    );
    return workspaceId ?? null;
  } catch {
    return null;
  }
};

const LoginForm: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    mode: "onChange",
  });

  const onSubmit = async (dto: LoginFormData) => {
    try {
      const { data } = await callLogin(dto);
      dispatch(setCurrentUser(data.user));

      const joinedWorkspaceId = await handlePendingInvite();
      if (joinedWorkspaceId) {
        navigate(`/${joinedWorkspaceId}`, { replace: true });
        return;
      }

      const userWorkspaces = data.user.workspaces;
      if (userWorkspaces.length > 0) {
        navigate(`/${userWorkspaces[0].id}`);
      } else {
        navigate("/");
      }
    } catch (error: any) {
      toastError(error.message);
    }
  };

  const handleGoogleSuccess = async (credentialResponse: CredentialResponse) => {
    try {
      if (!credentialResponse.credential)
        throw new Error("No credential from Google");

      const res = await callLoginGoogle(credentialResponse.credential);
      const user = normalizeAuthUser(res.data.user);
      dispatch(setCurrentUser(user));
      toastSuccess("Login successfully");

      // Xử lý invite token nếu có
      const joinedWorkspaceId = await handlePendingInvite();
      if (joinedWorkspaceId) {
        navigate(`/${joinedWorkspaceId}`, { replace: true });
        return;
      }

      navigate(getPostLoginPath(user));
    } catch (error: any) {
      toastError(error.message);
    }
  };

  return (
    <div className="w-full flex flex-col items-center justify-center z-10">
      <div
        className="absolute inset-0"
        style={{ background: "linear-gradient(135deg, #f8c8d4 0%, #e8d5f0 30%, #c8daf8 60%, #b8e8f8 100%)" }}
      />
      <div className="relative z-10 w-full max-w-md mx-4">
        <div className="bg-white rounded-2xl shadow-2xl px-8 py-8" style={{ boxShadow: "0 20px 60px rgba(0,0,0,0.12)" }}>
          {/* Logo */}
          <div className="flex justify-center mb-4">
            <img src="/favicon.svg" alt="logo" className="w-7 h-7" />
          </div>

          {/* Title */}
          <h1 className="text-center text-xl font-bold text-gray-800 mb-1">Welcome back!</h1>
          <p className="text-center text-sm text-gray-500 mb-5">
            Don't have an account?{" "}
            <a href="/register" className="font-medium" style={{ color: "#7C5CE8" }}>Sign up</a>
          </p>

          {/* Social login */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={() => toastError("Google login failed")}
              theme="outline" size="large" shape="circle" text="signin_with" width="100%"
            />
            <button
              type="button"
              onClick={() => {
                if (!YOUR_GITHUB_CLIENT_ID) { console.error("Missing GitHub Client ID"); return; }
                window.location.href = `https://github.com/login/oauth/authorize?client_id=${YOUR_GITHUB_CLIENT_ID}&redirect_uri=${FRONTEND_URL}/oauth/github&scope=user:email`;
              }}
              className="h-[41px] rounded-3xl border border-gray-300 flex items-center justify-center gap-2 hover:bg-blue-50 transition"
            >
              <img src="/icons/github.svg" className="w-5 h-5" />
              <span className="text-xs">GitHub</span>
            </button>
          </div>

          {/* Divider */}
          <div className="flex items-center gap-3 mb-4">
            <div className="flex-1 h-px bg-gray-200" />
            <span className="text-xs text-gray-400">or</span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3">
            {/* Email */}
            <div>
              <input
                {...register("email")}
                type="email"
                placeholder="jane@example.com"
                className={`w-full rounded-xl border px-4 py-2.5 text-sm text-gray-700 placeholder-gray-400 outline-none transition-all ${
                  errors.email ? "border-red-500" : "border-gray-300 focus:border-indigo-400"
                }`}
              />
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
            </div>

            {/* Password */}
            <div>
              <div className="relative">
                <input
                  {...register("password")}
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className={`w-full rounded-xl border px-4 py-2.5 pr-11 text-sm text-gray-700 placeholder-gray-400 outline-none transition-all ${
                    errors.password ? "border-red-500" : "border-gray-300 focus:border-indigo-400"
                  }`}
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  {showPassword ? <Eye size={16} /> : <EyeOff size={16} />}
                </button>
              </div>
              {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-xl py-2.5 text-white text-sm font-semibold mt-1 transition-all hover:opacity-90 active:scale-[0.98]"
              style={{ background: "linear-gradient(90deg, #7C5CE8 0%, #9B7CF8 100%)", boxShadow: "0 4px 15px rgba(124,92,232,0.4)" }}
            >
              {isSubmitting ? "Logging in..." : "Log In"}
            </button>
          </form>
        </div>
      </div>
      <div className="relative z-10 mt-5 text-sm text-gray-500">Need help?</div>
    </div>
  );
};

export default LoginForm;