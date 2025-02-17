"use client";

import { useState, useEffect, useRef } from "react";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { CircleUser, Menu } from "lucide-react";
import clsx from "clsx";

export default function UserMenu() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { data: session } = useSession();

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
      <button
        onClick={toggleDropdown}
        className="flex items-center rounded-full border border-premium-borderColor bg-premium-background px-4 py-2 text-premium-secondary transition-shadow hover:shadow-lg focus:outline-none dark:border-premium-borderColorHover dark:bg-premium-secondaryLight dark:text-premium-textPrimary"
        type="button"
        aria-expanded={isDropdownOpen}
        aria-haspopup="menu"
      >
        <Menu className="mr-2 h-5 w-5" />
        <CircleUser className="h-6 w-6" />
      </button>

      {isDropdownOpen && (
        <div
          className="absolute right-0 z-20 mt-2 w-48 rounded-md border border-premium-borderColor bg-premium-background shadow-lg dark:bg-premium-secondary"
          role="menu"
        >
          <ul className="py-1">
            {session ? (
              <li>
                <button
                  onClick={() => {
                    setIsDropdownOpen(false);
                    signOut({ callbackUrl: "/" });
                  }}
                  className="block w-full cursor-pointer px-4 py-2 text-left text-red-500 hover:bg-premium-backgroundLight dark:hover:bg-premium-secondaryLight transition-all"
                >
                  Cerrar Sesión
                </button>
              </li>
            ) : (
              <>
                <li>
                  <Link
                    href="/login"
                    onClick={() => setIsDropdownOpen(false)}
                    className="block cursor-pointer px-4 py-2 hover:bg-premium-backgroundLight dark:hover:bg-premium-secondaryLight transition-all"
                  >
                    Iniciar Sesión
                  </Link>
                </li>
                <li>
                  <Link
                    href="/login/register"
                    onClick={() => setIsDropdownOpen(false)}
                    className="block cursor-pointer px-4 py-2 hover:bg-premium-backgroundLight dark:hover:bg-premium-secondaryLight transition-all"
                  >
                    Registrarse
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      )}
    </div>
  );
}
