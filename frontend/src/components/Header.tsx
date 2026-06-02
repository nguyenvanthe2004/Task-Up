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
import { callSearchTasks } from "../services/task";
import { Task } from "../types/task";

const NAV_ICONS = [
  { key: "notifications", icon: Bell, path: "/notifications" },
  { key: "help", icon: HelpCircle, path: "/help" },
  { key: "settings", icon: Settings, path: "/settings" },
];

const Header: React.FC = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  // Search states
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const mobileSearchRef = useRef<HTMLInputElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);
  const mobileSearchContainerRef = useRef<HTMLDivElement>(null);
  const searchDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const { workspaceId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const user = useSelector((state: RootState) => state.auth.currentUser);

  useEffect(() => {
    callGetUnreadCount()
      .then((res) => {
        const count =
          typeof res.data === "number" ? res.data : (res.data?.count ?? 0);
        setUnreadCount(count);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (!user?.id) return;
    const socketUrl = BASE_URL.replace(/\/api\/?$/, "");
    const socket = io(socketUrl, { withCredentials: true });

    socket.on("connect", () => socket.emit("join", { userId: user.id }));
    socket.on("notification:new", () => setUnreadCount((prev) => prev + 1));
    socket.on("notification:updated", (data: { isRead: boolean }) => {
      if (data.isRead) setUnreadCount((prev) => Math.max(0, prev - 1));
    });
    socket.on("notification:all-read", () => setUnreadCount(0));

    return () => {
      socket.emit("leave", { userId: user.id });
      socket.disconnect();
    };
  }, [user?.id]);

  useEffect(() => {
    if (location.pathname.endsWith("/notifications")) setUnreadCount(0);
  }, [location.pathname]);

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

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowResults(false);
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
    setShowResults(false);
    setSearchQuery("");
    setSearchResults([]);
  }, [location.pathname]);

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    setShowResults(true);

    if (searchDebounceRef.current) clearTimeout(searchDebounceRef.current);

    if (value.trim().length === 0) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    searchDebounceRef.current = setTimeout(async () => {
      try {
        const res = await callSearchTasks(value.trim());
        setSearchResults(res.data ?? []);
      } catch {
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    }, 300);
  };

  const handleSelectTask = (task: Task) => {
    setShowResults(false);
    setSearchQuery("");
    setSearchResults([]);
    setMobileSearchOpen(false);
    const spaceId = task.list?.category?.space?.id;
    const categoryId = task.list?.category?.id;
    const listId = task.list?.id;
    navigate(
      `/${workspaceId}/spaces/${spaceId}/${categoryId}/${listId}`,
    );
  };

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

  // ─── Helpers ────────────────────────────────────────────────────────────────
  const priorityDotClass = (priority: string) => {
    switch (priority) {
      case "urgent":
        return "bg-red-500";
      case "high":
        return "bg-orange-400";
      case "medium":
        return "bg-yellow-400";
      default:
        return "bg-slate-300";
    }
  };

  const renderNavIcon = (
    key: string,
    Icon: React.ElementType,
    path: string,
    size = 20,
  ) => {
    const isActive = location.pathname === `/${workspaceId}${path}`;
    const showBadge = key === "notifications" && unreadCount > 0;

    return (
      <button
        key={key}
        onClick={() => navigate(`/${workspaceId}${path}`)}
        className={`relative p-1.5 rounded-lg transition-all ${
          isActive
            ? "text-blue-600 bg-blue-50"
            : "text-slate-500 hover:bg-slate-50"
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

  // ─── Search dropdown (reusable) ─────────────────────────────────────────────
  const SearchDropdown = () => (
    <div className="absolute top-full mt-1.5 left-0 w-full bg-white rounded-xl shadow-lg border border-slate-100 z-50 overflow-hidden max-h-80 overflow-y-auto">
      {isSearching ? (
        <div className="flex items-center justify-center gap-2 py-6 text-slate-400 text-sm">
          <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v8z"
            />
          </svg>
          Searching...
        </div>
      ) : searchResults.length === 0 ? (
        <div className="py-6 text-center text-sm text-slate-400">
          No tasks found for "
          <span className="font-medium text-slate-600">{searchQuery}</span>"
        </div>
      ) : (
        <ul>
          {searchResults.map((task) => (
            <li key={task.id}>
              <button
                onClick={() => handleSelectTask(task)}
                className="w-full flex items-start gap-3 px-4 py-2.5 hover:bg-slate-50 transition-colors text-left border-b border-slate-50 last:border-0"
              >
                <span
                  className={`mt-1.5 w-2 h-2 rounded-full flex-shrink-0 ${priorityDotClass(task.priority)}`}
                />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-slate-800 truncate">
                    {task.name}
                  </p>
                  <p className="text-xs text-slate-400 truncate mt-0.5">
                    {[task.list?.category?.space?.name, task.list?.name]
                      .filter(Boolean)
                      .join(" · ")}
                  </p>
                </div>
                {task.status && (
                  <span
                    className="text-[10px] font-semibold px-2 py-0.5 rounded-full flex-shrink-0 mt-0.5 whitespace-nowrap"
                    style={{
                      backgroundColor: `${task.status.color}20`,
                      color: task.status.color,
                    }}
                  >
                    {task.status.name}
                  </span>
                )}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );

  // ─── Render ─────────────────────────────────────────────────────────────────
  return (
    <>
      <header className="flex justify-between items-center w-full px-4 sm:px-6 h-14 fixed top-0 z-50 bg-white border-b border-slate-100 shadow-sm">
        {/* Logo */}
        <div className="flex items-center gap-3 cursor-pointer">
          <img src="/favicon.svg" alt="logo" className="w-7 h-7" />
          <span className="text-lg font-bold text-slate-900 tracking-tight">
            TaskUp
          </span>
        </div>

        {/* Desktop search */}
        <div className="relative hidden sm:block" ref={searchRef}>
          <Search
            size={18}
            className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 z-10"
          />
          <input
            className="pl-9 pr-4 py-1.5 bg-slate-50 border border-slate-100 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 w-80 lg:w-96 transition-all"
            placeholder="Search tasks..."
            type="text"
            value={searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
            onFocus={() => searchQuery.trim() && setShowResults(true)}
          />
          {showResults && searchQuery.trim().length > 0 && <SearchDropdown />}
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-2">
          {/* Mobile search toggle */}
          <button
            className="sm:hidden p-1.5 rounded-lg hover:bg-slate-50 transition-colors text-slate-500"
            onClick={() => {
              setMobileSearchOpen((v) => !v);
              setMobileMenuOpen(false);
            }}
          >
            <Search size={18} />
          </button>

          {/* Desktop nav icons */}
          <div className="hidden md:flex items-center gap-0.5 border-l border-slate-100 ml-1 pl-3">
            {NAV_ICONS.map(({ key, icon, path }) =>
              renderNavIcon(key, icon, path),
            )}
          </div>

          {/* Desktop avatar dropdown */}
          <div className="relative ml-1 hidden md:block" ref={dropdownRef}>
            <button
              onClick={() => setIsDropdownOpen((v) => !v)}
              className="flex items-center focus:outline-none"
            >
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
                      src={
                        user?.avatar
                          ? user.avatar.startsWith("https")
                            ? user.avatar
                            : `${CLOUDINARY_URL}${user.avatar}`
                          : "/images/avatar.png"
                      }
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

          {/* Mobile menu toggle */}
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

      {/* Mobile search bar */}
      {mobileSearchOpen && (
        <div className="sm:hidden fixed top-14 left-0 right-0 z-40 bg-white border-b border-slate-100 px-4 py-3 shadow-sm">
          <div className="flex items-center gap-2">
            <div className="relative flex-1" ref={mobileSearchContainerRef}>
              <Search
                size={16}
                className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 z-10"
              />
              <input
                ref={mobileSearchRef}
                className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-100 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                placeholder="Search tasks..."
                type="text"
                value={searchQuery}
                onChange={(e) => handleSearchChange(e.target.value)}
                onFocus={() => searchQuery.trim() && setShowResults(true)}
              />
              {showResults && searchQuery.trim().length > 0 && (
                <SearchDropdown />
              )}
            </div>
            <button
              onClick={() => {
                setMobileSearchOpen(false);
                setSearchQuery("");
                setSearchResults([]);
                setShowResults(false);
              }}
              className="text-sm text-slate-500 hover:text-slate-700 px-1 flex-shrink-0"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Mobile menu */}
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
                    src={
                      user?.avatar
                        ? user.avatar.startsWith("http")
                          ? user.avatar
                          : `${CLOUDINARY_URL}${user.avatar}`
                        : "/images/avatar.png"
                    }
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
              <div className="border-t border-slate-100 pt-3 mt-3 flex items-center justify-between px-1">
                <div className="flex items-center gap-1">
                  {NAV_ICONS.map(({ key, icon, path }) =>
                    renderNavIcon(key, icon, path),
                  )}
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
