"use client";

import { useEffect, useRef, useState } from "react";
import { usePendingRequests } from "@/src/hooks/requests";
import { NotificationBell } from "./NotificationBell";
import { NotificationsPanel } from "./NotificationsPanel";

export function NotificationsContainer() {
  const [open, setOpen] = useState(false);
  const { requests, isLoadingRequests } = usePendingRequests(open);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    if (open) document.addEventListener("click", handler);
    return () => document.removeEventListener("click", handler);
  }, [open]);

  return (
    <div ref={ref} className="relative flex items-center justify-center">
      <NotificationBell
        unreadCount={requests.length}
        isOpen={open}
        onToggle={() => setOpen((v) => !v)}
      />

      <NotificationsPanel
        isOpen={open}
        notifications={requests}
        isLoading={isLoadingRequests}
        onClose={() => setOpen(false)}
      />
    </div>
  );
}
