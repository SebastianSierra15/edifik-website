"use client";

import { useState, useEffect, useRef } from "react";
import { signOut } from "next-auth/react";
import Link from "next/link";
import clsx from "clsx";
import { AdminMenuItem } from "@/src/hooks/admin";
import { NotificationsContainer } from "./notifications";
import { AdminMenuButton } from "./AdminMenuButton";

interface Props {
  menuItems: AdminMenuItem[];
  canManageRequests: boolean;
}

export function AdminMenuContainer({ menuItems, canManageRequests }: Props) {
  const [open, setOpen] = useState<boolean>(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const toggle = () => setOpen((prev) => !prev);
  const close = () => setOpen(false);

  // click (NO mousedown)
  useEffect(() => {
    if (!open) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        close();
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [open]);

  // Escape key
  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open]);

  return (
    <div ref={containerRef} className="relative inline-block text-left">
      <div className="flex items-center space-x-4">
        {canManageRequests && <NotificationsContainer />}

        <AdminMenuButton open={open} onToggle={toggle} />
      </div>

      {/* Overlay mobile */}
      {/* ===== DESKTOP DROPDOWN ===== */}
      {open && (
        <div
          className="hidden sm:block absolute right-0 top-full mt-2 w-56 rounded-md
               bg-premium-background dark:bg-premium-secondary
               shadow-lg z-50"
          role="menu"
        >
          <ul className="py-2 space-y-2">
            {menuItems.map(({ path, label, icon: Icon }) => (
              <li key={path}>
                <Link
                  href={path}
                  onClick={close}
                  className="flex items-center gap-3 px-6 py-3
                       text-premium-textPrimary dark:text-premium-textSecondary
                       hover:bg-premium-backgroundDark dark:hover:bg-premium-secondaryLight
                       transition-all"
                >
                  <Icon className="w-5 h-5 text-premium-primary dark:text-premium-primaryLight" />
                  {label}
                </Link>
              </li>
            ))}
          </ul>

          <div className="border-t border-premium-borderColor dark:border-premium-borderColorHover py-2">
            <button
              onClick={() => {
                close();
                signOut({ callbackUrl: "/" });
              }}
              className="block w-full text-left px-6 py-3
                   text-red-500 hover:bg-red-600 hover:text-white transition-all"
            >
              Cerrar Sesión
            </button>
          </div>
        </div>
      )}

      {/* ===== MOBILE SIDEBAR ===== */}
      <div
        className={clsx(
          "sm:hidden fixed top-0 right-0 h-full w-64",
          "bg-premium-background dark:bg-premium-secondary shadow-lg z-50",
          "transform transition-transform duration-300 ease-in-out",
          open ? "translate-x-0" : "translate-x-full"
        )}
      >
        <div className="flex items-center justify-between p-4 border-b border-premium-borderColor dark:border-premium-borderColorHover">
          <span className="text-lg font-semibold text-premium-primary dark:text-premium-primaryLight">
            Menú
          </span>
          <button
            onClick={close}
            className="text-premium-textPrimary dark:text-premium-textSecondary hover:text-red-500"
          >
            ✕
          </button>
        </div>

        <ul className="py-2 space-y-2">
          {menuItems.map(({ path, label, icon: Icon }) => (
            <li key={path}>
              <Link
                href={path}
                onClick={close}
                className="flex items-center gap-3 px-6 py-3
                     text-premium-textPrimary dark:text-premium-textSecondary
                     hover:bg-premium-backgroundDark dark:hover:bg-premium-secondaryLight
                     transition-all"
              >
                <Icon className="w-5 h-5 text-premium-primary dark:text-premium-primaryLight" />
                {label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="border-t border-premium-borderColor dark:border-premium-borderColorHover py-2">
          <button
            onClick={() => {
              close();
              signOut({ callbackUrl: "/" });
            }}
            className="block w-full text-left px-6 py-3
                 text-red-500 hover:bg-red-600 hover:text-white transition-all"
          >
            Cerrar Sesión
          </button>
        </div>
      </div>
    </div>
  );
}
