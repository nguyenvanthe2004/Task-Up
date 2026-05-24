import { Bell, HelpCircle, LogOut, Search, Settings } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { RootState } from "../redux/store";
import { logout } from "../redux/slices/currentUser";
import { callLogout } from "../services/auth";
import { toastError } from "../lib/toast";
import { CLOUDINARY_URL, BASE_URL } from "../constants";
import { normalizeImg } from "../lib/until";
import { io } from "socket.io-client";
import { callGetUnreadCount } from "../services/notifications";

// Tách icons ra ngoài để có thể pass badge vào
const NAV_ICONS = [
  { key: "notifications", icon: Bell, path: "/notifications" },
  { key: "help", icon: HelpCircle, path: "/help" },
  { key: "settings", icon: Settings, path: "/settings" },
];

const Header: React.FC = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0); // thêm state
  const dropdownRef = useRef<HTMLDivElement>(null);
  const mobileSearchRef = useRef<HTMLInputElement>(null);
  const { workspaceId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const user = useSelector((state: RootState) => state.auth.currentUser);

  useEffect(() => {
    callGetUnreadCount()
      .then((res) => {
        const count = typeof res.data === "number" ? res.data : res.data?.count ?? 0;
        setUnreadCount(count);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (!user?.id) return;

    const socketUrl = BASE_URL.replace(/\/api\/?$/, "");
    const socket = io(socketUrl, { withCredentials: true });

    socket.on("connect", () => socket.emit("join", { userId: user.id }));

    socket.on("notification:new", () => {
      setUnreadCount((prev) => prev + 1);
    });

    socket.on("notification:updated", (data: { isRead: boolean }) => {
      if (data.isRead) setUnreadCount((prev) => Math.max(0, prev - 1));
    });

    socket.on("notification:all-read", () => {
      setUnreadCount(0);
    });

    return () => {
      socket.emit("leave", { userId: user.id });
      socket.disconnect();
    };
  }, [user?.id]);

  useEffect(() => {
    if (location.pathname.endsWith("/notifications")) {
      setUnreadCount(0);
    }
  }, [location.pathname]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (mobileSearchOpen && mobileSearchRef.current) {
      setTimeout(() => mobileSearchRef.current?.focus(), 50);
    }
  }, [mobileSearchOpen]);

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

  const renderNavIcon = (key: string, Icon: React.ElementType, path: string, size = 20) => {
    const isActive = location.pathname === `/${workspaceId}${path}`;
    const showBadge = key === "notifications" && unreadCount > 0;

    return (
      <button
        key={key}
        onClick={() => navigate(`/${workspaceId}${path}`)}
        className={`relative p-1.5 rounded-lg transition-all ${
          isActive ? "text-blue-600 bg-blue-50" : "text-slate-500 hover:bg-slate-50"
        }`}
      >
        <Icon size={size} />
        {showBadge && (
          <span className="absolute -top-0.5 -right-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[9px] font-bold text-white leading-none">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </button>
    );
  };

  return (
    <>
      <header className="flex justify-between items-center w-full px-4 sm:px-6 h-14 fixed top-0 z-50 bg-white border-b border-slate-100 shadow-sm">
        <div className="flex items-center gap-3 cursor-pointer">
          <img src="/favicon.svg" alt="logo" className="w-7 h-7" />
          <span className="text-lg font-bold text-slate-900 tracking-tight">TaskUp</span>
        </div>

        <div className="relative hidden sm:block">
          <Search size={18} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            className="pl-9 pr-4 py-1.5 bg-slate-50 border border-slate-100 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 w-80 lg:w-96 transition-all"
            placeholder="Search..."
            type="text"
          />
        </div>

        <div className="flex items-center gap-2">
          <button
            className="sm:hidden p-1.5 rounded-lg hover:bg-slate-50 transition-colors text-slate-500"
            onClick={() => { setMobileSearchOpen((v) => !v); setMobileMenuOpen(false); }}
          >
            <Search size={18} />
          </button>

          <div className="hidden md:flex items-center gap-0.5 border-l border-slate-100 ml-1 pl-3">
            {NAV_ICONS.map(({ key, icon, path }) => renderNavIcon(key, icon, path))}
          </div>

          <div className="relative ml-1 hidden md:block" ref={dropdownRef}>
            <button onClick={() => setIsDropdownOpen((v) => !v)} className="flex items-center focus:outline-none">
              <img
                alt="User Profile"
                className="w-8 h-8 rounded-full ring-2 ring-indigo-100 cursor-pointer flex-shrink-0 hover:ring-indigo-300 transition-all"
                src={normalizeImg(user?.avatar)}
              />
            </button>
            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-slate-100 py-1.5 z-50 animate-in fade-in slide-in-from-top-1 duration-150">
                <div className="px-4 py-3 border-b border-slate-100">
                  <div className="flex items-center gap-3">
                    <img
                      alt="User Profile"
                      className="w-9 h-9 rounded-full ring-2 ring-indigo-100 flex-shrink-0"
                      src={user?.avatar ? (user.avatar.startsWith("https") ? user.avatar : `${CLOUDINARY_URL}${user.avatar}`) : "/images/avatar.png"}
                    />
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-slate-900 truncate">{user.fullName || "User"}</p>
                      <p className="text-xs text-slate-500 truncate">{user.email || ""}</p>
                    </div>
                  </div>
                </div>
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

          <button
            className="md:hidden p-1.5 rounded-lg hover:bg-slate-50 transition-colors text-slate-500 ml-1"
            onClick={() => { setMobileMenuOpen((v) => !v); setMobileSearchOpen(false); }}
          >
            <span className="material-symbols-outlined text-[22px]">
              {mobileMenuOpen ? "close" : "menu"}
            </span>
          </button>
        </div>
      </header>

      {mobileSearchOpen && (
        <div className="sm:hidden fixed top-14 left-0 right-0 z-40 bg-white border-b border-slate-100 px-4 py-3 shadow-sm">
          <div className="relative flex items-center gap-2">
            <div className="relative flex-1">
              <Search size={16} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                ref={mobileSearchRef}
                className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-100 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                placeholder="Search..."
                type="text"
              />
            </div>
            <button onClick={() => setMobileSearchOpen(false)} className="text-sm text-slate-500 hover:text-slate-700 px-1 flex-shrink-0">
              Cancel
            </button>
          </div>
        </div>
      )}

      {mobileMenuOpen && (
        <>
          <div className="md:hidden fixed inset-0 top-14 z-30 bg-black/10" onClick={() => setMobileMenuOpen(false)} />
          <div className="md:hidden fixed top-14 left-0 right-0 z-40 bg-white border-b border-slate-100 shadow-lg">
            <div className="px-4 py-3 space-y-1">
              <div className="border-t border-slate-100 pt-3 pb-1 space-y-1">
                <div className="flex items-center gap-3 px-3 py-2">
                  <img
                    alt="User Profile"
                    className="w-9 h-9 rounded-full ring-2 ring-indigo-100 flex-shrink-0"
                    src={user?.avatar ? (user.avatar.startsWith("http") ? user.avatar : `${CLOUDINARY_URL}${user.avatar}`) : "/images/avatar.png"}
                  />
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-slate-900 truncate">{user.fullName || "User"}</p>
                    <p className="text-xs text-slate-500 truncate">{user.email || ""}</p>
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
              <div className="border-t border-slate-100 pt-3 mt-3 flex items-center justify-between px-1">
                <div className="flex items-center gap-1">
                  {NAV_ICONS.map(({ key, icon, path }) => renderNavIcon(key, icon, path))}
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