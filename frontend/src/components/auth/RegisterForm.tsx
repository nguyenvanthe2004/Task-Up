import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  RegisterFormData,
  registerSchema,
  VerifyCodeFormData,
  verifyCodeSchema,
} from "../../validations/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  callLoginGithub,
  callLoginGoogle,
  callRegister,
  callVerifyEmail,
} from "../../services/auth";
import { toastError, toastSuccess } from "../../lib/toast";
import { Eye, EyeOff } from "lucide-react";
import { CredentialResponse, GoogleLogin } from "@react-oauth/google";
import { setCurrentUser } from "../../redux/slices/currentUser";
import { useDispatch } from "react-redux";
import { YOUR_GITHUB_CLIENT_ID } from "../../constants";

export default function Register() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [showCodeInput, setShowCodeInput] = useState(false);
  const [emailForVerify, setEmailForVerify] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    mode: "onChange",
  });

  const onSubmitRegister = async (data: RegisterFormData) => {
    try {
      await callRegister({
        fullName: data.fullName,
        email: data.email,
        password: data.password,
      });

      toastSuccess("Verification code sent to your email");
      setEmailForVerify(data.email);
      setShowCodeInput(true);
    } catch (err: any) {
      toastError(err.message);
    }
  };

  const {
    register: registerVerify,
    handleSubmit: handleVerifySubmit,
    formState: { errors: verifyErrors, isSubmitting: isVerifying },
  } = useForm<VerifyCodeFormData>({
    resolver: zodResolver(verifyCodeSchema),
    mode: "onChange",
  });

  const onSubmitVerify = async (data: VerifyCodeFormData) => {
    try {
      await callVerifyEmail(emailForVerify, data.code);
      toastSuccess("Account created successfully");
      navigate("/login");
    } catch (err: any) {
      toastError(err.message || "Invalid verification code");
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
      navigate("/");
    } catch (error: any) {
      toastError(error.message);
    }
  };

  const handleGithubLogin = async (code: string) => {
    try {
      const res = await callLoginGithub(code);

      dispatch(setCurrentUser(res.data.user));
      toastSuccess("Login with GitHub successfully");

      window.history.replaceState({}, document.title, "/login");

      navigate("/");
    } catch (error: any) {
      toastError(error.message);
    }
  };

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get("code");

    if (code) {
      handleGithubLogin(code);
    }
  }, []);

  return (
    <div className="w-full max-w-[650px] flex flex-col items-center justify-center bg-white rounded-lg shadow-lg z-10">
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(135deg, #f8c8d4 0%, #e8d5f0 30%, #c8daf8 60%, #b8e8f8 100%)",
        }}
      />

      {/* Card */}
      <div className="relative z-10 w-full max-w-[650px] mx-4 my-8">
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
            Create an account
          </h1>
          <p className="text-center text-sm text-gray-500 mb-7">
            Already have an account?{" "}
            <a
              href="/login"
              className="font-medium"
              style={{ color: "#7C5CE8" }}
            >
              Log in
            </a>
          </p>

          {/* Social blurred placeholder */}
          <div className="grid grid-cols-2 gap-4 py-5">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={() => toastError("Google login failed")}
              theme="outline"
              size="large"
              shape="circle"
              text="signin_with"
              width="100%"
            />

            <button
              type="button"
              onClick={() => {
                if (!YOUR_GITHUB_CLIENT_ID) {
                  console.error("Missing GitHub Client ID");
                  return;
                }

                window.location.href = `https://github.com/login/oauth/authorize?client_id=${YOUR_GITHUB_CLIENT_ID}&redirect_uri=http://localhost:5173/login&scope=user:email`;
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

          {!showCodeInput && (
            <form
              onSubmit={handleSubmit(onSubmitRegister)}
              className="px-5 pb-6 flex flex-col gap-4"
            >
              {/* Full name */}
              <div>
                <div className="mb-3">
                  <input
                    {...register("fullName")}
                    placeholder="Jane Doe"
                    className={`w-full px-4 py-3 pr-12 border rounded-lg focus:outline-none ${
                      errors.fullName
                        ? "border-red-500 focus:ring-red-500"
                        : "border-gray-300 focus:ring-orange-500"
                    }`}
                  />
                </div>
                {errors.fullName && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.fullName.message}
                  </p>
                )}
              </div>

              {/* Work email */}
              <div>
                <div className="mb-3">
                  <input
                    {...register("email")}
                    placeholder="jane@example.com"
                    className={`w-full px-4 py-3 pr-12 border rounded-lg focus:outline-none ${
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
                <div className="mb-3 relative">
                  <input
                    {...register("password")}
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    className={`w-full px-4 py-3 pr-12 border rounded-lg focus:outline-none ${
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
                    {showPassword ? <EyeOff /> : <Eye />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.password.message}
                  </p>
                )}
              </div>

              {/* Confirm password */}
              <div>
                <div className="mb-5 relative">
                  <input
                    {...register("confirmPassword")}
                    type={showConfirm ? "text" : "password"}
                    placeholder="••••••••"
                    className={`w-full px-4 py-3 pr-12 border rounded-lg focus:outline-none ${
                      errors.confirmPassword
                        ? "border-red-500 focus:ring-red-500"
                        : "border-gray-300 focus:ring-orange-500"
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm(!showConfirm)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showConfirm ? <EyeOff /> : <Eye />}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.confirmPassword.message}
                  </p>
                )}
              </div>

              {/* Terms */}
              <p className="text-xs text-gray-400 text-center mb-5 leading-relaxed">
                By creating an account, you agree to our{" "}
                <a href="#" style={{ color: "#7C5CE8" }}>
                  Terms of Service
                </a>{" "}
                and{" "}
                <a href="#" style={{ color: "#7C5CE8" }}>
                  Privacy Policy
                </a>
              </p>

              {/* Submit */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full rounded-xl py-3 text-white text-sm font-semibold transition-all hover:opacity-90 active:scale-[0.98]"
                style={{
                  background:
                    "linear-gradient(90deg, #7C5CE8 0%, #9B7CF8 100%)",
                  boxShadow: "0 4px 15px rgba(124,92,232,0.4)",
                }}
              >
                {isSubmitting ? "Creating account..." : "Create Account"}
              </button>
            </form>
          )}
          {showCodeInput && (
            <form
              onSubmit={handleVerifySubmit(onSubmitVerify)}
              className="space-y-5"
            >
              <div className="mb-5 relative">
                <label className="text-sm font-semibold mb-2 block">
                  Verification Code
                </label>
                <input
                  {...registerVerify("code")}
                  maxLength={6}
                  placeholder="Enter 6-digit code"
                  className={`w-full px-4 py-3 pr-12 border rounded-lg focus:outline-none ${
                    verifyErrors.code
                      ? "border-red-500 focus:ring-red-500"
                      : "border-orange-500 focus:ring-orange-500"
                  }`}
                />
                {verifyErrors.code ? (
                  <p className="text-red-500 text-sm mt-1">
                    {verifyErrors.code.message}
                  </p>
                ) : (
                  <p className="text-gray-500 text-sm mt-1">
                    We sent a verification code to your email
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={isVerifying}
                className="w-full rounded-xl py-3 text-white text-sm font-semibold transition-all hover:opacity-90 active:scale-[0.98]"
                style={{
                  background:
                    "linear-gradient(90deg, #7C5CE8 0%, #9B7CF8 100%)",
                  boxShadow: "0 4px 15px rgba(124,92,232,0.4)",
                }}
              >
                {isVerifying ? "Verifying..." : "Verify & Login"}
              </button>
            </form>
          )}
        </div>
      </div>

      {/* Need help */}
      <div className="relative z-10 mb-8 text-sm text-gray-500">Need help?</div>
    </div>
  );
}
