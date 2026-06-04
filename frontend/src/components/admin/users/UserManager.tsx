import { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setCurrentUser } from "../../../redux/slices/currentUser";
import {
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  Search,
  Shield,
  ShieldCheck,
  Users,
} from "lucide-react";
import { UserRole } from "../../../constants";
import { isAdminRole, normalizeAuthUser } from "../../../lib/auth";
import { toastError, toastSuccess } from "../../../lib/toast";
import { normalizeImg } from "../../../lib/until";
import { RootState } from "../../../redux/store";
import {
  AdminUser,
  callGetUsers,
  callUpdateUserRole,
} from "../../../services/user";
import LoadingPage from "../../ui/LoadingPage";

const ROLE_OPTIONS = [
  { value: UserRole.USER, label: "User", icon: Users },
  { value: UserRole.ADMIN, label: "Admin", icon: ShieldCheck },
] as const;

const roleBadgeClass: Record<string, string> = {
  [UserRole.ADMIN]: "bg-blue-50 text-blue-700 ring-blue-100",
  [UserRole.USER]: "bg-slate-100 text-slate-600 ring-slate-200",
};

const UserManager: React.FC = () => {
  const dispatch = useDispatch();
  const currentUser = useSelector((state: RootState) => state.auth.currentUser);

  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<number | null>(null);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 10;

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const res = await callGetUsers(page, limit);
      const list = (res.data.data ?? []).map((u) => normalizeAuthUser(u));
      setUsers(list);
      setTotalPages(res.data.totalPages ?? 1);
    } catch (error: any) {
      toastError(error.message ?? "Không thể tải danh sách người dùng");
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const filteredUsers = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return users;
    return users.filter(
      (u) =>
        u.fullName.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q),
    );
  }, [users, search]);

  const stats = useMemo(() => {
    const adminCount = users.filter((u) => u.role === UserRole.ADMIN).length;
    const activeCount = users.filter((u) => u.isActive !== false).length;
    return { total: users.length, adminCount, activeCount };
  }, [users]);

  const handleRoleChange = async (userId: number, role: UserRole) => {
    const target = users.find((u) => u.id === userId);
    if (!target || target.role === role) return;

    if (userId === currentUser?.id && role !== UserRole.ADMIN) {
      toastError("Bạn không thể tự hạ quyền admin của chính mình");
      return;
    }

    setUpdatingId(userId);
    try {
      const res = await callUpdateUserRole(userId, role);
      const updated = res.data ?? { ...target, role };
      setUsers((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, ...updated, role } : u)),
      );
      if (userId === currentUser?.id) {
        dispatch(
          setCurrentUser(
            normalizeAuthUser({ ...currentUser, ...updated, role }),
          ),
        );
      }
      toastSuccess("Cập nhật quyền thành công");
    } catch (error: any) {
      toastError(error.message ?? "Không thể cập nhật quyền");
    } finally {
      setUpdatingId(null);
    }
  };

  if (!isAdminRole(currentUser?.role)) {
    return null;
  }

  if (loading && users.length === 0) {
    return <LoadingPage />;
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Shield className="w-5 h-5 text-blue-600" />
            <h2 className="text-xl font-semibold text-slate-900">
              Quản lý người dùng
            </h2>
          </div>
          <p className="text-sm text-slate-500">
            Phân quyền <span className="font-medium text-slate-700">User</span>{" "}
            hoặc{" "}
            <span className="font-medium text-blue-600">Admin</span> cho từng
            tài khoản.
          </p>
        </div>
        <button
          type="button"
          onClick={fetchUsers}
          disabled={loading}
          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          Làm mới
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          {
            label: "Trang hiện tại",
            value: stats.total,
            sub: `Trang ${page}/${totalPages}`,
            color: "text-slate-900",
            bg: "bg-white",
          },
          {
            label: "Admin",
            value: stats.adminCount,
            sub: "trên trang này",
            color: "text-blue-600",
            bg: "bg-blue-50/50",
          },
          {
            label: "Đã kích hoạt",
            value: stats.activeCount,
            sub: "trên trang này",
            color: "text-emerald-600",
            bg: "bg-emerald-50/50",
          },
        ].map((item) => (
          <div
            key={item.label}
            className={`${item.bg} rounded-xl border border-slate-200 p-4 shadow-sm`}
          >
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
              {item.label}
            </p>
            <p className={`text-2xl font-bold ${item.color}`}>{item.value}</p>
            <p className="text-xs text-slate-400 mt-0.5">{item.sub}</p>
          </div>
        ))}
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Tìm theo tên hoặc email..."
          className="w-full pl-10 pr-4 py-2.5 text-sm bg-white border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all"
        />
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="text-left px-4 py-3 font-semibold text-slate-600">
                  Người dùng
                </th>
                <th className="text-left px-4 py-3 font-semibold text-slate-600 hidden md:table-cell">
                  Email
                </th>
                <th className="text-left px-4 py-3 font-semibold text-slate-600 hidden lg:table-cell">
                  Trạng thái
                </th>
                <th className="text-left px-4 py-3 font-semibold text-slate-600">
                  Vai trò
                </th>
                <th className="text-left px-4 py-3 font-semibold text-slate-600">
                  Phân quyền
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-4 py-12 text-center text-slate-400"
                  >
                    Không tìm thấy người dùng nào.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => {
                  const isSelf = user.id === currentUser?.id;
                  const RoleIcon =
                    user.role === UserRole.ADMIN ? ShieldCheck : Users;

                  return (
                    <tr
                      key={user.id}
                      className="hover:bg-slate-50/80 transition-colors"
                    >
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-slate-100 overflow-hidden flex items-center justify-center shrink-0">
                            {user.avatar ? (
                              <img
                                src={normalizeImg(user.avatar)}
                                alt={user.fullName}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <span className="text-xs font-bold text-slate-500">
                                {user.fullName?.charAt(0)?.toUpperCase() ?? "?"}
                              </span>
                            )}
                          </div>
                          <div className="min-w-0">
                            <p className="font-medium text-slate-900 truncate flex items-center gap-1.5">
                              {user.fullName}
                              {isSelf && (
                                <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-indigo-50 text-indigo-600">
                                  Bạn
                                </span>
                              )}
                            </p>
                            <p className="text-xs text-slate-400 truncate md:hidden">
                              {user.email}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-slate-600 hidden md:table-cell">
                        {user.email}
                      </td>
                      <td className="px-4 py-3 hidden lg:table-cell">
                        <span
                          className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full ${
                            user.isActive !== false
                              ? "bg-emerald-50 text-emerald-700"
                              : "bg-amber-50 text-amber-700"
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              user.isActive !== false
                                ? "bg-emerald-500"
                                : "bg-amber-500"
                            }`}
                          />
                          {user.isActive !== false
                            ? "Hoạt động"
                            : "Chưa xác thực"}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full ring-1 ${
                            roleBadgeClass[user.role] ??
                            roleBadgeClass[UserRole.USER]
                          }`}
                        >
                          <RoleIcon className="w-3.5 h-3.5" />
                          {user.role === UserRole.ADMIN ? "Admin" : "User"}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <select
                          value={user.role}
                          disabled={updatingId === user.id}
                          onChange={(e) =>
                            handleRoleChange(
                              user.id,
                              e.target.value as UserRole,
                            )
                          }
                          className="text-sm pr-8 border border-slate-200 rounded-lg px-3 py-1.5 bg-white text-slate-700 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {ROLE_OPTIONS.map((opt) => (
                            <option key={opt.value} value={opt.value}>
                              {opt.label}
                            </option>
                          ))}
                        </select>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-slate-100 bg-slate-50/50">
            <p className="text-xs text-slate-500">
              Trang {page} / {totalPages}
            </p>
            <div className="flex items-center gap-2">
              <button
                type="button"
                disabled={page <= 1 || loading}
                onClick={() => setPage((p) => p - 1)}
                className="p-1.5 rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                disabled={page >= totalPages || loading}
                onClick={() => setPage((p) => p + 1)}
                className="p-1.5 rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserManager;
