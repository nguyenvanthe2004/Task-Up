import { Bell, HelpCircle, Settings } from "lucide-react";
import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const icons = [
  { key: "notifications", icon: Bell, path: "/notifications" },
  { key: "help", icon: HelpCircle, path: "/help" },
  { key: "settings", icon: Settings, path: "/settings" },
];

const Header: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [activeIcon, setActiveIcon] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <>
      <header className="flex justify-between items-center w-full px-4 sm:px-6 h-14 fixed top-0 z-50 bg-white border-b border-slate-100 shadow-sm">
        {/* Left: Logo + Nav */}
        <div className="flex items-center gap-3">
          <span
            className="material-symbols-outlined text-primary text-2xl font-l font-bold"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            <img src="/favicon.svg" alt="logo" className="w-7 h-7" />
          </span>
          <span className="text-lg font-bold text-slate-900 tracking-tight">
            TaskUp
          </span>
        </div>

        <div className="relative hidden sm:block">
          <span className="material-symbols-outlined absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 text-[18px]">
            search
          </span>
          <input
            className="pl-9 pr-4 py-1.5 bg-slate-50 border border-slate-100 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 w-80 lg:w-96 transition-all"
            placeholder="Search..."
            type="text"
          />
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2">
          {/* Search icon – mobile only */}
          <button
            className="sm:hidden p-1.5 rounded-lg hover:bg-slate-50 transition-colors text-slate-500"
            onClick={() => setMobileSearchOpen((v) => !v)}
          >
            <span className="material-symbols-outlined text-[22px]">
              search
            </span>
          </button>

          {/* Create Task */}
          <button className="hidden xs:flex items-center gap-1 bg-indigo-600 text-white px-3 sm:px-4 py-1.5 rounded-lg text-sm font-semibold hover:bg-indigo-700 active:scale-95 transition-all">
            <span className="text-lg leading-none">+</span>
            <span className="hidden sm:inline">Create Task</span>
          </button>

          {/* Icon Actions – hidden on mobile */}
          <div className="hidden md:flex items-center gap-0.5 border-l border-slate-100 ml-1 pl-3">
            {icons.map(({ key, icon: Icon, path }) => {
              const isActive = location.pathname === path;

              return (
                <button
                  key={key}
                  onClick={() => navigate(path)} // ✅ vẫn dùng navigate
                  className={`p-1.5 rounded-lg transition-all
                  ${
                    isActive
                    ? "text-blue-600 bg-blue-50"
                    : "text-slate-500 hover:bg-slate-50"
                  }
                `}
                >
                  <Icon size={20} />
                </button>
              );
            })}
          </div>

          {/* Avatar */}
          <img
            alt="User Profile"
            className="w-8 h-8 rounded-full ring-2 ring-indigo-100 cursor-pointer flex-shrink-0 ml-1"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuAZRSra3UPHnRbDg4lmWu6IduACF3hcKURkZKpPksATTp6cJD6j303kAQAZbtpNyVYxe4k_pJYhDtUhfSlgnB_fI0UURRQXQbG98K_bac-lZpz0-H4hahIfAI-4MFIvTYWHLfKPR5fVDC4BlDd2SKqk6fMVQKxMboQEQPp38KQJwjhw_-xPJCLX3sUbPoGatf_xt0AXt7con2O1agVgbLlekaXnr_W-FtbSSD2Z3vAlKWU3kiBbAIJMrCrG84cyRYIlREkEiZGRTcI"
          />

          {/* Hamburger – mobile only */}
          <button
            className="md:hidden p-1.5 rounded-lg hover:bg-slate-50 transition-colors text-slate-500 ml-1"
            onClick={() => setMobileMenuOpen((v) => !v)}
          >
            <span className="material-symbols-outlined text-[22px]">
              {mobileMenuOpen ? "close" : "menu"}
            </span>
          </button>
        </div>
      </header>

      {/* Mobile Search Bar */}
      {mobileSearchOpen && (
        <div className="sm:hidden fixed top-14 left-0 right-0 z-40 bg-white border-b border-slate-100 px-4 py-3 shadow-sm">
          <div className="relative">
            <span className="material-symbols-outlined absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 text-[18px]">
              search
            </span>
            <input
              autoFocus
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-100 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              placeholder="Search..."
              type="text"
            />
          </div>
        </div>
      )}

      {/* Mobile Nav Menu */}
      {mobileMenuOpen && (
        <>
          <div
            className="md:hidden fixed inset-0 top-14 z-30 bg-black/10"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="md:hidden fixed top-14 left-0 right-0 z-40 bg-white border-b border-slate-100 shadow-lg">
            <div className="px-4 py-3 space-y-1">
              {/* Nav links */}
              {[
                { label: "Space", active: false },
                { label: "Project", active: true },
                { label: "List", active: false },
              ].map(({ label, active }) => (
                <a
                  key={label}
                  href="#"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    active
                      ? "text-indigo-600 bg-indigo-50"
                      : "text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  {label}
                </a>
              ))}

              <div className="border-t border-slate-100 pt-3 mt-3 flex items-center justify-between px-3">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-slate-500 cursor-pointer hover:text-slate-700 text-[22px]">
                    notifications
                  </span>
                  <span className="material-symbols-outlined text-slate-500 cursor-pointer hover:text-slate-700 text-[22px]">
                    help
                  </span>
                  <span className="material-symbols-outlined text-slate-500 cursor-pointer hover:text-slate-700 text-[22px]">
                    settings
                  </span>
                </div>
                <button className="flex items-center gap-1 bg-indigo-600 text-white px-4 py-1.5 rounded-lg text-sm font-semibold hover:bg-indigo-700 active:scale-95 transition-all">
                  + Create Task
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default Header;
