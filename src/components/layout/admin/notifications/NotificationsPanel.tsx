"use client";

import { useRouter } from "next/navigation";
import clsx from "clsx";
import { NotificationSkeleton } from "./NotificationSkeleton";
import { NotificationItem } from "./NotificationItem";
import { PendingRequest } from "@/src/interfaces";

interface Props {
  isOpen: boolean;
  notifications: PendingRequest[];
  isLoading: boolean;
  onClose: () => void;
}

export function NotificationsPanel({
  isOpen,
  notifications,
  isLoading,
  onClose,
}: Props) {
  const router = useRouter();

  if (!isOpen) return null;

  return (
    <div
      className={clsx(
        "fixed top-14 right-4 md:right-4 z-50",
        "h-auto max-h-[80vh] w-[90vw] max-w-[400px]",
        "bg-premium-background dark:bg-premium-secondary",
        "shadow-lg border border-premium-borderColor dark:border-premium-borderColorHover rounded-md",
        "overflow-y-auto transition-transform duration-300 ease-in-out",
        isOpen ? "translate-x-0" : "translate-x-full"
      )}
    >
      <div className="p-4 border-b border-premium-borderColor dark:border-premium-borderColorHover flex justify-between items-center">
        <span className="text-lg font-semibold text-premium-primary dark:text-premium-primaryLight">
          Notificaciones
        </span>
        <button
          onClick={onClose}
          className="text-premium-textPrimary dark:text-premium-textSecondary hover:text-premium-primary"
        >
          ✕
        </button>
      </div>

      {isLoading ? (
        <NotificationSkeleton />
      ) : notifications.length > 0 ? (
        <ul className="divide-y divide-premium-borderColor dark:divide-premium-borderColorHover">
          {notifications.map((notif) => (
            <NotificationItem
              key={notif.id}
              notification={notif}
              onClick={() => {
                onClose();
                router.push("/admin/solicitudes");
              }}
            />
          ))}
        </ul>
      ) : (
        <p className="p-4 text-center text-premium-textSecondary">
          No hay solicitudes pendientes.
        </p>
      )}
    </div>
  );
}
