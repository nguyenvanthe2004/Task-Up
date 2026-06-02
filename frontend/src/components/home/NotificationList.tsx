import { ArrowRight, Bell, Clock, CheckCheck } from "lucide-react";
import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Notification } from "../../types/notification";

interface Props {
  notifications: Notification[];
}

const NotificationList: React.FC<Props> = ({ notifications }) => {
  const navigate = useNavigate();
  const { workspaceId } = useParams();

  const groupNotificationsByDate = () => {
    const grouped: Record<string, Notification[]> = {};

    notifications.forEach((notification) => {
      const date = new Date(notification.createdAt);

      const today = new Date();
      const yesterday = new Date();
      yesterday.setDate(today.getDate() - 1);

      let label = date.toLocaleDateString("vi-VN");

      if (date.toDateString() === today.toDateString()) {
        label = "Today";
      } else if (date.toDateString() === yesterday.toDateString()) {
        label = "Yesterday";
      }

      if (!grouped[label]) {
        grouped[label] = [];
      }
      grouped[label].push(notification);
    });

    return grouped;
  };

  const groupedNotifications = groupNotificationsByDate();

  return (
    <section className="bg-white p-5 sm:p-6 rounded-xl border border-slate-100 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Bell className="text-indigo-600 w-4 h-4" />
          <h2 className="text-sm font-bold text-slate-900">
            Recent Notifications
          </h2>

          <span className="bg-indigo-50 text-indigo-600 text-[10px] font-bold px-1.5 py-0.5 rounded-full">
            {notifications.length}
          </span>
        </div>

        <button
          onClick={() => navigate(`/${workspaceId}/notifications`)}
          className="text-indigo-600 text-[11px] font-bold hover:underline flex items-center gap-1"
        >
          View All <ArrowRight className="w-3 h-3" />
        </button>
      </div>

      {notifications.length === 0 ? (
        <div className="text-center py-8 text-slate-400 text-sm">
          <CheckCheck className="w-8 h-8 mx-auto mb-2 text-green-300" />
          No notifications
        </div>
      ) : (
        <div className="space-y-5">
          {Object.entries(groupedNotifications).map(([date, items]) => (
            <div key={date}>
              <div className="text-xs font-semibold text-slate-400 mb-3 uppercase">
                {date}
              </div>

              <div className="space-y-0">
                {items.map((notification, index) => (
                  <div
                    key={notification.id}
                    className={`flex gap-3 ${
                      index < items.length - 1
                        ? "border-b border-slate-50 pb-4 mb-4"
                        : ""
                    }`}
                  >
                    <div className="flex flex-col items-center pt-1">
                      <div
                        className={`w-2.5 h-2.5 rounded-full ${
                          notification.isRead ? "bg-slate-300" : "bg-indigo-500"
                        }`}
                      />
                    </div>

                    <div className="flex-1">
                      <div className="flex justify-between gap-2">
                        <h4
                          className={`text-sm font-semibold ${
                            notification.isRead
                              ? "text-slate-600"
                              : "text-slate-900"
                          }`}
                        >
                          {notification.title}
                        </h4>

                        <span className="text-[11px] text-slate-400 flex items-center gap-1 whitespace-nowrap">
                          <Clock className="w-3 h-3" />
                          {new Date(notification.createdAt).toLocaleTimeString(
                            "vi-VN",
                            {
                              hour: "2-digit",
                              minute: "2-digit",
                            },
                          )}
                        </span>
                      </div>

                      <p className="text-xs text-slate-500 mt-1">
                        {notification.message}
                      </p>

                      {notification.task && (
                        <p className="text-[11px] text-indigo-600 mt-2">
                          Task: {notification.task.name}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default NotificationList;
