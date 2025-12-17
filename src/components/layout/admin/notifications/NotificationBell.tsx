"use client";

import { Bell } from "lucide-react";
import clsx from "clsx";

interface Props {
  unreadCount: number;
  isOpen: boolean;
  onToggle: () => void;
}

export default function NotificationBell({
  unreadCount,
  isOpen,
  onToggle,
}: Props) {
  return (
    <button
      onClick={onToggle}
      aria-expanded={isOpen}
      className={clsx(
        "p-2 rounded-md cursor-pointer transition-all",
        "text-premium-secondary dark:text-premium-textPrimary",
        "hover:text-premium-primary dark:hover:text-premium-primaryLight"
      )}
    >
      <span className="relative inline-flex">
        <Bell className="h-6 w-6" />

        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center pointer-events-none">
            <span className="absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75 animate-ping" />
            <span className="relative inline-flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white shadow">
              {unreadCount}
            </span>
          </span>
        )}
      </span>
    </button>
  );
}
