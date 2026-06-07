import React, { useEffect, useState } from "react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
dayjs.extend(relativeTime);
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { io } from "socket.io-client";
import { BASE_URL } from "../../constants";
import {
  callGetNotifications,
  callGetUnreadCount,
  callMarkAsRead,
  callMarkAllAsRead,
} from "../../services/notifications";
import { useParams } from "react-router-dom";
import {
  AtSign,
  Bell,
  CheckCheck,
  CircleCheckBig,
  Pencil,
  RefreshCw,
} from "lucide-react";
import { FilterTab, Notification } from "../../types/notification";

const iconByType = (type: string) => {
  switch (type) {
    case "comment":
      return {
        icon: <AtSign className="w-4 h-4" />,
        bg: "bg-indigo-100 text-indigo-600",
      };
    case "task":
      return {
        icon: <CircleCheckBig className="w-4 h-4" />,
        bg: "bg-emerald-100 text-emerald-600",
      };
    case "attachment":
      return {
        icon: <Pencil className="w-4 h-4" />,
        bg: "bg-amber-100 text-amber-600",
      };
    case "activity":
      return {
        icon: <RefreshCw className="w-4 h-4" />,
        bg: "bg-violet-100 text-violet-600",
      };
    default:
      return {
        icon: <Bell className="w-4 h-4" />,
        bg: "bg-slate-100 text-slate-500",
      };
  }
};

const groupByDate = (notifications: Notification[]) => {
  const today = dayjs().format("YYYY-MM-DD");
  const yesterday = dayjs().subtract(1, "day").format("YYYY-MM-DD");
  const groups: Record<string, Notification[]> = {};

  for (const n of notifications) {
    const date = dayjs(n.createdAt).format("YYYY-MM-DD");
    const label =
      date === today
        ? "Today"
        : date === yesterday
          ? "Yesterday"
          : dayjs(n.createdAt).format("MMM D, YYYY");
    if (!groups[label]) groups[label] = [];
    groups[label].push(n);
  }
  return groups;
};

const NotificationPage: React.FC = () => {
  const user = useSelector((state: RootState) => state.auth.currentUser);
  const { workspaceId } = useParams();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [filter, setFilter] = useState<FilterTab>("All");
  const [loading, setLoading] = useState(false);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const wsId = workspaceId ? Number(workspaceId) : undefined;
      const [notiRes, countRes] = await Promise.all([
        callGetNotifications(wsId),
        callGetUnreadCount(wsId),
      ]);

      const notificationsData = Array.isArray(notiRes.data)
        ? notiRes.data
        : (notiRes.data?.data ?? notiRes.data?.notifications ?? []);

      const unread =
        typeof countRes.data === "number"
          ? countRes.data
          : (countRes.data?.count ?? countRes.data?.data ?? 0);

      setNotifications(notificationsData);
      setUnreadCount(unread);
    } catch (e) {
      console.error("fetchNotifications error:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, [workspaceId]);

  useEffect(() => {
    if (!user?.id) return;
    const socketUrl = BASE_URL.replace(/\/api\/?$/, "");

    const socket = io(socketUrl, {
      withCredentials: true,
      transports: ["websocket", "polling"],
    });

    socket.on("connect", () => {
      socket.emit("join", { userId: user.id });
    });

    socket.on("notification:new", (data: Notification) => {
      setNotifications((prev) => [data, ...prev]);
      setUnreadCount((prev) => prev + 1);
    });

    socket.on("notification:updated", (data: Notification) => {
      setNotifications((prev) =>
        prev.map((n) => (n.id === data.id ? { ...n, ...data } : n)),
      );
      if (data.isRead) setUnreadCount((prev) => Math.max(0, prev - 1));
    });

    socket.on("notification:all-read", () => {
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      setUnreadCount(0);
    });

    return () => {
      socket.emit("leave", { userId: user.id });
      socket.disconnect();
    };
  }, [user]);

  const handleMarkAsRead = async (id: number) => {
    try {
      await callMarkAsRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)),
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch {}
  };

  const handleMarkAllAsRead = async () => {
    try {
      await callMarkAllAsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      setUnreadCount(0);
    } catch {}
  };

  const filtered =
    filter === "Unread"
      ? notifications.filter((n) => !n.isRead)
      : notifications;

  const grouped = groupByDate(filtered);

  return (
    <main className="lg:ml-64 pt-16 px-6 mt-10 md:px-10 pb-16 min-h-screen bg-slate-50">
      <div className="max-w-8xl mx-auto">
        {/* HEADER */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                Notifications
              </h1>
              {unreadCount > 0 && (
                <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-indigo-600 px-1.5 text-[10px] font-bold text-white">
                  {unreadCount}
                </span>
              )}
            </div>
            <p className="text-sm text-slate-500 mt-1">
              Manage your updates and activities.
            </p>
          </div>

          <div className="flex items-center gap-2">
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllAsRead}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-500 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 hover:text-slate-700 transition-colors"
              >
                <CheckCheck className="w-3.5 h-3.5" />
                Mark all read
              </button>
            )}

            <div className="flex items-center p-1 bg-white border border-slate-200 rounded-xl shadow-sm">
              {(["All", "Unread"] as FilterTab[]).map((item, i) => (
                <button
                  key={item}
                  onClick={() => setFilter(item)}
                  className={`px-4 py-1.5 text-sm rounded-lg transition-all font-medium ${
                    filter === item
                      ? "bg-indigo-600 text-white shadow-sm"
                      : "text-slate-500 hover:bg-slate-100"
                  }`}
                >
                  {item}
                  {item === "Unread" && unreadCount > 0 && (
                    <span className="ml-1.5 text-[10px] font-bold">
                      ({unreadCount})
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </header>

        {/* CONTENT */}
        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="h-20 rounded-xl bg-slate-100 animate-pulse"
              />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="mt-20 text-center py-12">
            <Bell className="w-8 h-8 text-slate-300 mx-auto mb-3" />
            <p className="text-sm text-slate-400">
              {filter === "Unread"
                ? "No unread notifications."
                : "You're all caught up."}
            </p>
          </div>
        ) : (
          <div className="space-y-10">
            {Object.entries(grouped).map(([label, items]) => (
              <section key={label}>
                <h3
                  className={`text-xs font-bold uppercase tracking-widest mb-5 ${
                    label === "Today" ? "text-indigo-600" : "text-slate-400"
                  }`}
                >
                  {label}
                </h3>

                <div className="space-y-3">
                  {items.map((n) => {
                    const { icon, bg } = iconByType(n.type);
                    return (
                      <div
                        key={n.id}
                        onClick={() => !n.isRead && handleMarkAsRead(n.id)}
                        className={`group flex gap-4 p-4 rounded-xl border transition-all cursor-pointer ${
                          n.isRead
                            ? "bg-slate-50 border-slate-200/60 hover:bg-white"
                            : "bg-white border-slate-200 hover:shadow-md hover:border-indigo-300"
                        }`}
                      >
                        {/* icon */}
                        <div
                          className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 ${bg}`}
                        >
                          {icon}
                        </div>

                        {/* content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2 mb-0.5">
                            <p
                              className={`text-sm font-semibold leading-snug ${
                                n.isRead ? "text-slate-500" : "text-slate-800"
                              }`}
                            >
                              {n.title}
                            </p>
                            <div className="flex items-center gap-2 flex-shrink-0">
                              {!n.isRead && (
                                <span className="w-2 h-2 rounded-full bg-indigo-500 flex-shrink-0" />
                              )}
                              <span className="text-[11px] text-slate-400 whitespace-nowrap">
                                {dayjs(n.createdAt).fromNow()}
                              </span>
                            </div>
                          </div>

                          <p
                            className={`text-[13px] leading-relaxed ${
                              n.isRead ? "text-slate-400" : "text-slate-500"
                            }`}
                          >
                            {n.message}
                          </p>

                          {n.task && (
                            <span className="inline-flex items-center gap-1 mt-1.5 text-[11px] font-medium text-indigo-500 bg-indigo-50 px-2 py-0.5 rounded-md">
                              {n.task.name}
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>
            ))}
          </div>
        )}
      </div>
    </main>
  );
};

export default NotificationPage;
