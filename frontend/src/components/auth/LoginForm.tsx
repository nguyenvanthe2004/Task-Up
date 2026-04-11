import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";

import { LoginFormData, loginSchema } from "../../validations/auth";
import {
  callLogin,
  callLoginGithub,
  callLoginGoogle,
} from "../../services/auth";
import { setCurrentUser } from "../../redux/slices/currentUser";
import { toastError, toastSuccess } from "../../lib/toast";
import { CredentialResponse, GoogleLogin } from "@react-oauth/google";
import { YOUR_GITHUB_CLIENT_ID } from "../../constants";
import { Eye, EyeOff } from "lucide-react";

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
      toastSuccess("Login successfully");
      navigate("/home");
    } catch (error: any) {
      toastError(error.message);
    }
  };

  const handleGoogleSuccess = async (
    credentialResponse: CredentialResponse,
  ) => {
    try {
      if (!credentialResponse.credential) {
        throw new Error("No credential from Google");
      }

      const res = await callLoginGoogle(credentialResponse.credential);

      dispatch(setCurrentUser(res.data.user));
      toastSuccess("Login successfully");
      navigate("/home");
    } catch (error: any) {
      toastError(error.message);
    }
  };

  return (
    <div className="w-full max-w-[600px] flex flex-col items-center justify-center p-8 bg-white rounded-lg shadow-lg z-10">
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(135deg, #f8c8d4 0%, #e8d5f0 30%, #c8daf8 60%, #b8e8f8 100%)",
        }}
      />
      <div className="relative z-10 w-full max-w-[600px] mx-4">
        <div
          className="bg-white rounded-3xl shadow-2xl px-10 py-12"
          style={{ boxShadow: "0 20px 60px rgba(0,0,0,0.12)" }}
        >
          {/* Logo */}
          <div className="flex justify-center mb-6">
            <span
              className="material-symbols-outlined text-primary text-2xl font-l font-bold"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              <img src="/favicon.svg" alt="logo" className="w-7 h-7" />
            </span>
          </div>

          {/* Title */}
          <h1 className="text-center text-2xl font-bold text-gray-800 mb-1">
            Welcome back!
          </h1>
          <p className="text-center text-sm text-gray-500 mb-7">
            Don't have an account?{" "}
            <a
              href="/register"
              className="font-medium"
              style={{ color: "#7C5CE8" }}
            >
              Sign up
            </a>
          </p>

          {/* Google / Social blurred button placeholder */}
          <div className="grid grid-cols-2 gap-4 py-10">
            {/* Google */}
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={() => toastError("Google login failed")}
              theme="outline"
              size="large"
              shape="circle"
              text="signin_with"
              width="100%"
            />

            {/* GitHub */}
            <button
              type="button"
              onClick={() => {
                if (!YOUR_GITHUB_CLIENT_ID) {
                  console.error("Missing GitHub Client ID");
                  return;
                }

                window.location.href = `https://github.com/login/oauth/authorize?client_id=${YOUR_GITHUB_CLIENT_ID}&redirect_uri=http://localhost:5173/oauth/github&scope=user:email`;
              }}
              className="h-[41px] rounded-3xl border border-gray-300 flex items-center justify-center gap-2 hover:bg-blue-50 transition"
            >
              <img src="/icons/github.svg" className="w-5 h-5" />
              <span className="text-sm">Đăng nhập bằng GitHub</span>
            </button>
          </div>

          {/* SSO */}
          <button className="w-full rounded-xl py-3 mb-5 border border-gray-200 bg-white text-gray-700 text-sm font-medium flex items-center justify-center gap-2 hover:bg-gray-50 transition-colors">
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <path d="M3 18l-1-4 9-2 9 2-1 4H3z" />
              <path d="M7 18V9a5 5 0 0 1 10 0v9" />
            </svg>
            Continue with SSO
          </button>

          {/* Divider */}
          <div className="flex items-center gap-3 mb-5">
            <div className="flex-1 h-px bg-gray-200" />
            <span className="text-xs text-gray-400">or</span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="px-5 pb-6 flex flex-col gap-4"
          >
            {/* Email */}
            <div>
              <div className="mb-3">
                <input
                  {...register("email")}
                  type="email"
                  placeholder="jane@example.com"
                  className={`w-full rounded-xl border px-4 py-3 text-sm text-gray-700 placeholder-gray-400 outline-none transition-all ${
                    errors.email
                      ? "border-red-500 focus:ring-red-500"
                      : "border-gray-300 focus:ring-orange-500"
                  }`}
                />
              </div>
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Password */}
            <div>
              <div className="mb-5 relative">
                <input
                  {...register("password")}
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className={`w-full rounded-xl border px-4 py-3 pr-11 text-sm text-gray-700 placeholder-gray-400 outline-none transition-all ${
                    errors.password
                      ? "border-red-500 focus:ring-red-500"
                      : "border-gray-300 focus:ring-orange-500"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? (
                    <Eye />
                  ) : (
                    <EyeOff />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-xl py-3 text-white text-sm font-semibold mb-4 transition-all hover:opacity-90 active:scale-[0.98]"
              style={{
                background: "linear-gradient(90deg, #7C5CE8 0%, #9B7CF8 100%)",
                boxShadow: "0 4px 15px rgba(124,92,232,0.4)",
              }}
            >
              {isSubmitting ? "Logging in..." : "Log In"}
            </button>
          </form>
        </div>
      </div>

      <div className="relative z-10 mt-8 text-sm text-gray-500">Need help?</div>
    </div>
  );
};

export default LoginForm;
