"use client";

import { Bell } from "lucide-react";
import clsx from "clsx";

interface Props {
  unreadCount: number;
  isOpen: boolean;
  onToggle: () => void;
}

export function NotificationBell({ unreadCount, isOpen, onToggle }: Props) {
  return (
    <>
      <button
        onClick={onToggle}
        aria-expanded={isOpen}
        className={clsx(
          "p-2 rounded-md cursor-pointer transition-all",
          "text-premium-secondary dark:text-premium-textPrimary",
          "hover:text-premium-primary dark:hover:text-premium-primaryLight"
        )}
      >
        <Bell className="h-6 w-6" />
      </button>

      {unreadCount > 0 && (
        <div className="absolute -top-1 -right-1 flex items-center justify-center">
          <span className="absolute w-5 h-5 rounded-full bg-red-500 opacity-75 animate-ping" />
          <span className="relative w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center shadow-md transition-all duration-500">
            {unreadCount}
          </span>
        </div>
      )}
    </>
  );
}
