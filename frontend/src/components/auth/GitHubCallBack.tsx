import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { callLoginGithub } from "../../services/auth";
import { useDispatch } from "react-redux";
import { setCurrentUser } from "../../redux/slices/currentUser";
import { toastError, toastSuccess } from "../../lib/toast";

const GithubCallback = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLoginGithub = async (code: string) => {
    try {
      const res = await callLoginGithub(code);

      dispatch(setCurrentUser(res.data.user));
      toastSuccess("Login with GitHub successfully");
      navigate("/");
    } catch (error: any) {
      navigate("/login");
      toastError(error.message);
    }
  };

  useEffect(() => {
    const code = new URLSearchParams(window.location.search).get("code");
    if (code) {
      handleLoginGithub(code);
    }
  }, []);

  return (
    <div className="min-h-screen bg-[#0d1117] flex items-center justify-center">
      <div className="flex flex-col items-center gap-6 px-10 py-12 bg-white/[0.03] border border-white/10 rounded-lg shadow-2xl">
        {/* GitHub Icon with pulse */}
        <div className="relative flex items-center justify-center w-16 h-16">
          <span className="absolute inset-0 rounded-full bg-sky-500/10 animate-ping" />
          <svg
            className="w-10 h-10 fill-slate-200 drop-shadow-[0_0_12px_rgba(56,189,248,0.4)]"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61-.546-1.385-1.335-1.755-1.335-1.755-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 21.795 24 17.295 24 12c0-6.63-5.37-12-12-12z" />
          </svg>
        </div>

        {/* Text */}
        <div className="text-center space-y-1">
          <p className="text-slate-100 font-semibold text-lg tracking-tight">
            Signing in with GitHub
          </p>
          <p className="text-slate-500 text-sm">Please wait a moment...</p>
        </div>

        {/* Progress bar */}
        <div className="w-48 h-0.5 bg-white/10 rounded-full overflow-hidden">
          <div className="h-full w-1/3 bg-gradient-to-r from-sky-400 to-violet-500 rounded-full animate-[progress_1.6s_ease-in-out_infinite]" />
        </div>
      </div>

      <style>{`
        @keyframes progress {
          0%   { transform: translateX(-100%); }
          100% { transform: translateX(400%); }
        }
      `}</style>
    </div>
  );
};

export default GithubCallback;
