import { Bell, HelpCircle, LogOut, Search, Settings, User } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { RootState } from "../redux/store";
import { logout } from "../redux/slices/currentUser";
import { callLogout } from "../services/auth";
import { toastError } from "../lib/toast";
import { CLOUDINARY_URL } from "../constants";

const icons = [
  { key: "notifications", icon: Bell, path: "/notifications" },
  { key: "help", icon: HelpCircle, path: "/help" },
  { key: "settings", icon: Settings, path: "/settings" },
];

const Header: React.FC = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const mobileSearchRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const user = useSelector((state: RootState) => state.auth.currentUser);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Auto-focus mobile search input when opened
  useEffect(() => {
    if (mobileSearchOpen && mobileSearchRef.current) {
      setTimeout(() => mobileSearchRef.current?.focus(), 50);
    }
  }, [mobileSearchOpen]);

  // Close mobile menu when navigating
  useEffect(() => {
    setMobileMenuOpen(false);
    setMobileSearchOpen(false);
  }, [location.pathname]);

  const handleLogout = async () => {
    try {
      setIsDropdownOpen(false);
      dispatch(logout());
      await callLogout();
      navigate("/login");
    } catch (error: any) {
      toastError(error.message);
    }
  };

  return (
    <>
      <header className="flex justify-between items-center w-full px-4 sm:px-6 h-14 fixed top-0 z-50 bg-white border-b border-slate-100 shadow-sm">
        {/* Left: Logo */}
        <div
          onClick={() => navigate("/home")}
          className="flex items-center gap-3 cursor-pointer"
        >
          <img src="/favicon.svg" alt="logo" className="w-7 h-7" />
          <span className="text-lg font-bold text-slate-900 tracking-tight">
            TaskUp
          </span>
        </div>

        {/* Center: Search – desktop */}
        <div className="relative hidden sm:block">
          <Search
            size={18}
            className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400"
          />
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
            onClick={() => {
              setMobileSearchOpen((v) => !v);
              setMobileMenuOpen(false);
            }}
          >
            <Search size={18} />
          </button>

          {/* Icon Actions – hidden on mobile */}
          <div className="hidden md:flex items-center gap-0.5 border-l border-slate-100 ml-1 pl-3">
            {icons.map(({ key, icon: Icon, path }) => {
              const isActive = location.pathname === path;
              return (
                <button
                  key={key}
                  onClick={() => navigate(path)}
                  className={`p-1.5 rounded-lg transition-all ${
                    isActive
                      ? "text-blue-600 bg-blue-50"
                      : "text-slate-500 hover:bg-slate-50"
                  }`}
                >
                  <Icon size={20} />
                </button>
              );
            })}
          </div>

          {/* Avatar + Dropdown – desktop only */}
          <div className="relative ml-1 hidden md:block" ref={dropdownRef}>
            <button
              onClick={() => setIsDropdownOpen((v) => !v)}
              className="flex items-center focus:outline-none"
            >
              <img
                alt="User Profile"
                className="w-8 h-8 rounded-full ring-2 ring-indigo-100 cursor-pointer flex-shrink-0 hover:ring-indigo-300 transition-all"
                src={`${CLOUDINARY_URL}/${user.avatar}`}
              />
            </button>

            {/* Dropdown Menu */}
            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-slate-100 py-1.5 z-50 animate-in fade-in slide-in-from-top-1 duration-150">
                {/* User info */}
                <div className="px-4 py-3 border-b border-slate-100">
                  <div className="flex items-center gap-3">
                    <img
                      alt="User Profile"
                      className="w-9 h-9 rounded-full ring-2 ring-indigo-100 flex-shrink-0"
                      src={`${CLOUDINARY_URL}/${user.avatar}`}
                    />
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-slate-900 truncate">
                        {user.fullName || "User"}
                      </p>
                      <p className="text-xs text-slate-500 truncate">
                        {user.email || ""}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Logout */}
                <div className="border-t border-slate-100 pt-1 pb-1">
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <LogOut size={16} />
                    Log out
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Hamburger – mobile only */}
          <button
            className="md:hidden p-1.5 rounded-lg hover:bg-slate-50 transition-colors text-slate-500 ml-1"
            onClick={() => {
              setMobileMenuOpen((v) => !v);
              setMobileSearchOpen(false);
            }}
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
          <div className="relative flex items-center gap-2">
            <div className="relative flex-1">
              <Search
                size={16}
                className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                ref={mobileSearchRef}
                className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-100 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                placeholder="Search..."
                type="text"
              />
            </div>
            <button
              onClick={() => setMobileSearchOpen(false)}
              className="text-sm text-slate-500 hover:text-slate-700 px-1 flex-shrink-0"
            >
              Cancel
            </button>
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
              <div className="border-t border-slate-100 pt-3 pb-1 space-y-1">
                <div className="flex items-center gap-3 px-3 py-2">
                  <img
                    alt="User Profile"
                    className="w-9 h-9 rounded-full ring-2 ring-indigo-100 flex-shrink-0"
                    src={`${CLOUDINARY_URL}/${user.avatar}`}
                  />
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-slate-900 truncate">
                      {user.fullName || "User"}
                    </p>
                    <p className="text-xs text-slate-500 truncate">
                      {user.email || ""}
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
                >
                  <LogOut size={16} />
                  Log out
                </button>
              </div>

              {/* Icons row */}
              <div className="border-t border-slate-100 pt-3 mt-3 flex items-center justify-between px-1">
                <div className="flex items-center gap-1">
                  {icons.map(({ key, icon: Icon, path }) => {
                    const isActive = location.pathname === path;
                    return (
                      <button
                        key={key}
                        onClick={() => navigate(path)}
                        className={`p-2 rounded-lg transition-colors ${
                          isActive
                            ? "text-blue-600 bg-blue-50"
                            : "text-slate-500 hover:bg-slate-50"
                        }`}
                      >
                        <Icon size={20} />
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default Header;
