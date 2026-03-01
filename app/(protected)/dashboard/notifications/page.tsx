"use client";

import { useEffect, useMemo, useState } from "react";
import axios from "@/lib/api/axios";
import { API } from "@/lib/api/endpoints";
import { Bell, Check, CheckCheck } from "lucide-react";
import { toast } from "react-hot-toast";

type NotificationItem = {
  _id: string;
  type: string;
  message: string;
  isRead: boolean;
  createdAt?: string;
};

const getErrorMessage = (error: unknown, fallback: string) => {
  if (error && typeof error === "object" && "message" in error) {
    return String((error as { message?: string }).message);
  }
  return fallback;
};

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(true);

  const unreadCount = useMemo(
    () => notifications.filter((item) => !item.isRead).length,
    [notifications],
  );

  const fetchNotifications = async () => {
    try {
      const res = await axios.get(API.NOTIFICATION.LIST);
      setNotifications(res.data?.data || []);
    } catch (error: unknown) {
      toast.error(getErrorMessage(error, "Failed to fetch notifications"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const markAsRead = async (notificationId: string) => {
    try {
      await axios.put(API.NOTIFICATION.READ(notificationId));
      setNotifications((prev) =>
        prev.map((item) =>
          item._id === notificationId ? { ...item, isRead: true } : item,
        ),
      );
    } catch (error: unknown) {
      toast.error(getErrorMessage(error, "Failed to mark as read"));
    }
  };

  const markAllAsRead = async () => {
    try {
      await axios.put(API.NOTIFICATION.READ_ALL);
      setNotifications((prev) => prev.map((item) => ({ ...item, isRead: true })));
      toast.success("All notifications marked as read");
    } catch (error: unknown) {
      toast.error(getErrorMessage(error, "Failed to mark all as read"));
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black text-gradient italic tracking-tighter">
            Notifications
          </h2>
          <p className="text-[var(--text-secondary)] font-medium">
            Report and account updates are shown here.
          </p>
        </div>

        {notifications.length > 0 && (
          <button
            type="button"
            onClick={markAllAsRead}
            className="btn-secondary flex items-center gap-2"
          >
            <CheckCheck className="w-4 h-4" />
            Mark all read
          </button>
        )}
      </div>

      <div className="card-premium p-0 overflow-hidden">
        {loading ? (
          <div className="p-10 text-center text-[var(--text-secondary)] text-sm">
            Loading notifications...
          </div>
        ) : notifications.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <div className="w-14 h-14 rounded-full bg-rose-500/10 text-rose-500 mx-auto flex items-center justify-center">
              <Bell className="w-6 h-6" />
            </div>
            <p className="font-bold text-[var(--text-main)]">No notifications yet</p>
            <p className="text-sm text-[var(--text-secondary)]">
              You&apos;ll see report updates and moderation actions here.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-[var(--border-color)]">
            {notifications.map((item) => (
              <div
                key={item._id}
                className={`p-4 md:p-5 flex items-start justify-between gap-4 ${
                  item.isRead ? "opacity-80" : "bg-rose-500/5"
                }`}
              >
                <div className="space-y-1">
                  <p className="text-sm font-semibold text-[var(--text-main)]">{item.message}</p>
                  <p className="text-xs text-[var(--text-secondary)] uppercase tracking-wide">
                    {item.type.replaceAll("_", " ")}
                  </p>
                </div>
                {!item.isRead && (
                  <button
                    type="button"
                    onClick={() => markAsRead(item._id)}
                    className="px-3 py-2 rounded-xl border border-rose-200 text-rose-500 hover:bg-rose-50 transition-colors text-xs font-bold uppercase tracking-wide flex items-center gap-1"
                  >
                    <Check className="w-3.5 h-3.5" />
                    Read
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {unreadCount > 0 && (
        <p className="text-xs text-[var(--text-secondary)] font-semibold">
          You have {unreadCount} unread notification{unreadCount > 1 ? "s" : ""}.
        </p>
      )}
    </div>
  );
}
