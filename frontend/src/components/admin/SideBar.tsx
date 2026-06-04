import { Link, useLocation, useNavigate } from "react-router-dom";
import {
    Users,
    ChevronLeft,
    ChevronRight,
    LogOut,
    Activity,
    Server,
    X,
    Shield,
} from "lucide-react";
import { useDispatch } from "react-redux";
import { logout } from "../../redux/slices/currentUser";
import { callLogout } from "../../services/auth";
import { toastError } from "../../lib/toast";

const navItems = [
    { label: "Quản lý người dùng", icon: Users, path: "/admin" },
];

interface SidebarProps {
    collapsed: boolean;
    setCollapsed: React.Dispatch<React.SetStateAction<boolean>>;
    mobileOpen: boolean;
    setMobileOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const sidebarShell =
    "flex flex-col h-full bg-white border-r border-slate-200/80 shadow-[1px_0_12px_rgba(15,23,42,0.04)]";

export default function Sidebar({
    collapsed,
    setCollapsed,
    mobileOpen,
    setMobileOpen,
}: SidebarProps) {
    const location = useLocation();
    const dispatch = useDispatch();
    const navigate = useNavigate();



    const handleLogout = async () => {
        try {
            dispatch(logout());
            await callLogout();
            navigate("/login");
        } catch (error: any) {
            toastError(error.message);
        }
    };

    const isActive = (path: string) => {
        if (path === "/admin") {
            return location.pathname === "/admin" || location.pathname === "/admin/";
        }
        return location.pathname.startsWith(path);
    };

    const NavContent = () => (
        <div className="flex flex-col h-full">
            {/* Logo */}
            <div className="flex items-center gap-3 px-4 h-16 border-b border-slate-100 shrink-0">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center shrink-0 shadow-sm shadow-blue-600/20">
                    <Shield className="w-5 h-5 text-white" />
                </div>
                {!collapsed && (
                    <div className="overflow-hidden min-w-0">
                        <h1 className="text-sm font-semibold text-slate-900 truncate tracking-tight">
                            TaskUp
                        </h1>
                        <p className="text-[11px] text-slate-500 truncate font-medium">
                            Quản lý Hệ Thống
                        </p>
                    </div>
                )}
            </div>

            {/* Nav */}
            <nav className="flex-1 py-4 px-3 overflow-y-auto">
                {!collapsed && (
                    <p className="px-3 mb-2 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                        Menu chính
                    </p>
                )}
                <div className="space-y-0.5">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const active = isActive(item.path);
                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                onClick={() => setMobileOpen(false)}
                                title={collapsed ? item.label : ""}
                                className={`flex items-center gap-3 rounded-lg text-sm font-medium transition-all duration-150 group
                  ${collapsed ? "justify-center px-2 py-2.5" : "px-3 py-2.5"}
                  ${active
                                        ? "bg-blue-50 text-blue-700 shadow-sm shadow-blue-600/5 ring-1 ring-blue-100"
                                        : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                                    }`}
                            >
                                <Icon
                                    className={`w-[18px] h-[18px] shrink-0 ${active
                                            ? "text-blue-600"
                                            : "text-slate-400 group-hover:text-slate-600"
                                        }`}
                                />
                                {!collapsed && <span className="truncate">{item.label}</span>}
                            </Link>
                        );
                    })}
                </div>
            </nav>

            {/* Bottom */}
            <div className="border-t border-slate-100 p-3 space-y-2 shrink-0">
                {!collapsed && (
                    <div className="rounded-lg border border-slate-100 bg-white px-3 py-2.5 space-y-2 shadow-sm">
                        <div className="flex items-center gap-2 text-xs text-slate-600">
                            <span className="flex h-6 w-6 items-center justify-center rounded-md bg-emerald-50">
                                <Activity className="w-3.5 h-3.5 text-emerald-600" />
                            </span>
                            <span className="font-medium">Hệ thống hoạt động</span>
                            <span className="ml-auto w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        </div>
                        <div className="flex items-center gap-2 text-xs text-slate-600">
                            <span className="flex h-6 w-6 items-center justify-center rounded-md bg-blue-50">
                                <Server className="w-3.5 h-3.5 text-blue-600" />
                            </span>
                            <span className="font-medium">Máy chủ ổn định</span>
                        </div>
                    </div>
                )}
                <button
                    type="button"
                    onClick={handleLogout}
                    title={collapsed ? "Đăng xuất" : ""}
                    className={`flex items-center gap-3 w-full rounded-lg text-sm font-medium text-slate-600 hover:bg-red-50 hover:text-red-600 transition-colors
            ${collapsed ? "justify-center p-2.5" : "px-3 py-2.5"}`}
                >
                    <LogOut className="w-4 h-4 shrink-0" />
                    {!collapsed && <span>Đăng xuất</span>}
                </button>
            </div>

            <button
                type="button"
                onClick={() => setCollapsed(!collapsed)}
                className="hidden lg:flex items-center justify-center h-11 border-t border-slate-100 text-slate-400 hover:text-slate-700 hover:bg-slate-50 transition-colors"
                aria-label={collapsed ? "Mở rộng sidebar" : "Thu gọn sidebar"}
            >
                {collapsed ? (
                    <ChevronRight className="w-4 h-4" />
                ) : (
                    <ChevronLeft className="w-4 h-4" />
                )}
            </button>
        </div>
    );

    return (
        <>
            <aside
                className={`hidden lg:flex flex-col shrink-0 transition-[width] duration-300 ease-out ${sidebarShell} ${collapsed ? "w-[72px]" : "w-64"
                    }`}
            >
                <NavContent />
            </aside>

            {mobileOpen && (
                <div className="fixed inset-0 z-50 lg:hidden">
                    <div
                        className="absolute inset-0 bg-slate-900/20 backdrop-blur-[2px]"
                        onClick={() => setMobileOpen(false)}
                    />
                    <aside
                        className={`absolute left-0 top-0 bottom-0 w-64 ${sidebarShell}`}
                    >
                        <button
                            type="button"
                            onClick={() => setMobileOpen(false)}
                            className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                            aria-label="Đóng menu"
                        >
                            <X className="w-5 h-5" />
                        </button>
                        <NavContent />
                    </aside>
                </div>
            )}
        </>
    );
}
