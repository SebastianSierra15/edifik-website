"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import clsx from "clsx";
import { Bell, ArrowRight } from "lucide-react";
import { usePendingRequests } from "@/app/hooks/requests/usePendingRequests";
import NotificationSkeleton from "../skeletons/notificationSkeleton";

export default function NotificationBell() {
  const router = useRouter();
  const [showNotifications, setShowNotifications] = useState(false);
  const { requests: notifications, isLoadingRequests } = usePendingRequests();
  const [unreadNotifications, setUnreadNotifications] = useState(
    notifications.length
  );

  const notificationRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const eventSource = new EventSource("/api/requests/stream");

    eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data);

      setUnreadNotifications(() => {
        const count = data.data.length;
        return count;
      });
    };

    eventSource.onerror = () => {
      console.error("⚠️ Error en SSE");
      eventSource.close();
    };

    return () => {
      eventSource.close();
    };
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target as Node)
      ) {
        setShowNotifications(false);
      }
    };

    if (showNotifications) {
      document.addEventListener("click", handleClickOutside);
    }

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [showNotifications]);

  useEffect(() => {
    if (
      !showNotifications &&
      unreadNotifications === 0 &&
      notifications.length > 0
    ) {
      setUnreadNotifications(notifications.length);
    }
  }, [notifications]);

  const handleToggleNotifications = () => {
    if (!showNotifications && unreadNotifications > 0) {
      setUnreadNotifications(0);
    }
    setShowNotifications((prev) => !prev);
  };

  return (
    <div
      className="relative flex items-center justify-center"
      ref={notificationRef}
    >
      <button
        className={clsx(
          "p-2 rounded-md cursor-pointer transition-all",
          "text-premium-secondary dark:text-premium-textPrimary",
          "hover:text-premium-primary dark:hover:text-premium-primaryLight"
        )}
        onClick={handleToggleNotifications}
      >
        <Bell className="h-6 w-6" />
      </button>

      {unreadNotifications > 0 && (
        <div className="absolute -top-1 -right-1 flex items-center justify-center">
          <span className="absolute w-5 h-5 rounded-full bg-red-500 opacity-75 animate-ping" />
          <span className="relative w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center shadow-md transition-all duration-500">
            {unreadNotifications}
          </span>
        </div>
      )}

      {showNotifications && (
        <div
          className={clsx(
            "fixed top-14 right-4 md:right-4 h-auto max-h-[80vh] w-[90vw] max-w-[400px] bg-premium-background dark:bg-premium-secondary",
            "shadow-lg border border-premium-borderColor dark:border-premium-borderColorHover rounded-md",
            "overflow-y-auto transition-transform duration-300 ease-in-out",
            showNotifications ? "translate-x-0" : "translate-x-full"
          )}
        >
          <div className="p-4 border-b border-premium-borderColor dark:border-premium-borderColorHover flex justify-between items-center">
            <span className="text-lg font-semibold text-premium-primary dark:text-premium-primaryLight">
              Notificaciones
            </span>
            <button
              className="text-premium-textPrimary dark:text-premium-textSecondary hover:text-premium-primary dark:hover:text-premium-primaryLight"
              onClick={() => setShowNotifications(false)}
            >
              ✕
            </button>
          </div>

          {isLoadingRequests ? (
            <NotificationSkeleton />
          ) : notifications.length > 0 ? (
            <ul className="divide-y divide-premium-borderColor dark:divide-premium-borderColorHover">
              {notifications.map((notif) => (
                <li
                  key={notif.id}
                  className="px-3 py-2 flex items-center justify-between hover:bg-premium-backgroundDark dark:hover:bg-premium-secondaryLight transition-all cursor-pointer"
                  onClick={() => {
                    setShowNotifications(false);
                    router.push("/admin/solicitudes");
                  }}
                >
                  <div className="flex flex-col gap-1 flex-1">
                    <div className="flex items-center gap-2">
                      <span
                        className={clsx(
                          "px-2 py-1 text-xs font-semibold text-white rounded-full",
                          notif.operation === "agregar"
                            ? "bg-green-600"
                            : "bg-blue-600"
                        )}
                      >
                        {notif.operation}
                      </span>
                      <p className="text-sm text-premium-primary dark:text-premium-primaryLight font-semibold">
                        {notif.projectName}
                      </p>
                    </div>

                    <p className="text-xs text-premium-textSecondary">
                      {notif.userEmail}
                    </p>
                    <p className="text-xs text-premium-textSecondary">
                      {new Date(notif.date).toLocaleString()}
                    </p>
                  </div>
                  <ArrowRight className="h-4 w-4 text-premium-primary dark:text-premium-primaryLight ml-2" />
                </li>
              ))}
            </ul>
          ) : (
            <p className="p-4 text-center text-premium-textSecondary">
              No hay solicitudes pendientes.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
