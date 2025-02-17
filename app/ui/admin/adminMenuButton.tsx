"use client";

import { useState, useEffect, useRef } from "react";
import { signOut } from "next-auth/react";
import Link from "next/link";
import clsx from "clsx";
import { Menu, LucideIcon } from "lucide-react";
import NotificationBell from "./notificationBell";

export default function AdminMenuButton({
  menuItems,
  canManageRequests,
}: {
  menuItems: { path: string; label: string; icon: LucideIcon }[];
  canManageRequests: boolean;
}) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const toggleDropdown = () => setIsDropdownOpen((prev) => !prev);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div ref={dropdownRef} className="relative inline-block text-left">
      <div className="flex items-center space-x-4">
        {canManageRequests && <NotificationBell />}

        <button
          onClick={toggleDropdown}
          className="flex items-center justify-center p-2 rounded-md text-premium-secondary transition-all hover:text-premium-primary focus:outline-none dark:text-premium-textPrimary dark:hover:text-premium-primaryLight"
          type="button"
          aria-expanded={isDropdownOpen}
          aria-haspopup="menu"
        >
          <Menu className="h-6 w-6 transition-transform duration-300 hover:scale-110" />
        </button>
      </div>

      {isDropdownOpen && (
        <div
          onClick={() => setIsDropdownOpen(false)}
          className="fixed inset-0 bg-black bg-opacity-50 transition-opacity duration-300 sm:hidden"
        />
      )}

      {isDropdownOpen && (
        <>
          <div
            className={clsx(
              "fixed inset-0 bg-black  bg-opacity-50 transition-opacity duration-300 sm:hidden",
              isDropdownOpen ? "block" : "hidden"
            )}
            onClick={() => setIsDropdownOpen(false)}
          />

          <div
            className={clsx(
              "sm:absolute sm:top-full sm:right-0 sm:w-56 sm:rounded-md bg-premium-background dark:bg-premium-secondary shadow-lg z-50 mt-2",
              "fixed top-0 right-0 h-full w-64 transform transition-transform duration-300 ease-in-out",
              isDropdownOpen ? "translate-x-0" : "translate-x-full",
              "sm:translate-x-0 sm:absolute sm:h-auto sm:shadow-lg"
            )}
            role="menu"
          >
            <div className="flex items-center justify-between p-4 border-b border-premium-borderColor dark:border-premium-borderColorHover sm:hidden">
              <span className="text-lg font-semibold text-premium-primary dark:text-premium-primaryLight">
                Menú
              </span>
              <button
                onClick={() => setIsDropdownOpen(false)}
                className="text-premium-textPrimary dark:text-premium-textSecondary hover:text-red-500"
              >
                ✕
              </button>
            </div>

            <ul className="py-2 space-y-2">
              {menuItems?.map(({ path, label, icon: Icon }) => (
                <li key={path}>
                  <Link
                    href={path}
                    onClick={() => setIsDropdownOpen(false)}
                    className="flex items-center gap-3 px-6 py-3 text-premium-textPrimary dark:text-premium-textSecondary hover:bg-premium-backgroundDark dark:hover:bg-premium-secondaryLight transition-all"
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
                  setIsDropdownOpen(false);
                  signOut({ callbackUrl: "/" });
                }}
                className="block w-full text-left px-6 py-3 text-red-500 hover:bg-red-600 hover:text-white transition-all"
              >
                Cerrar Sesión
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
