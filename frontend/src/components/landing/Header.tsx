import { Bell, MessageCircleQuestionMark, Settings } from "lucide-react";
import type React from "react";
import { useNavigate } from "react-router-dom";

const Header: React.FC = () => {
  const navigate = useNavigate();
  return (
    <header className="flex justify-between items-center w-full mg-0 px-6 h-14 fixed top-0 left-0 z-50 bg-white border-b border-slate-100 shadow-sm">
      <div className="flex items-center gap-8">
        <div className="flex items-center gap-2">
          <span
            className="material-symbols-outlined text-primary text-2xl font-l font-bold"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            <img src="/favicon.svg" alt="logo" className="w-7 h-7" />
          </span>
          <span className="text-lg font-bold text-slate-900">TaskUp</span>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <div className="hidden md:flex items-center gap-2">
          <span className="material-symbols-outlined text-slate-500 hover:bg-slate-50 p-2 rounded-lg cursor-pointer transition-colors active:scale-95">
            <Bell />
          </span>
          <span className="material-symbols-outlined text-slate-500 hover:bg-slate-50 p-2 rounded-lg cursor-pointer transition-colors active:scale-95">
            <MessageCircleQuestionMark />
          </span>
          <span className="material-symbols-outlined text-slate-500 hover:bg-slate-50 p-2 rounded-lg cursor-pointer transition-colors active:scale-95">
            <Settings />
          </span>
        </div>
        <button onClick={() => navigate("/login")} className="bg-primary hover:bg-primary-dark text-white px-4 py-1.5 rounded text-sm font-semibold transition-all active:scale-95">
          Get Started
        </button>
      </div>
    </header>
  );
};

export default Header;
