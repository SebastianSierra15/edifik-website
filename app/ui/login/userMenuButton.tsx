"use client";

import { useState, useEffect, useRef } from "react";
import { signOut, useSession } from "next-auth/react";
import { FaUserCircle } from "react-icons/fa";
import { HiMenuAlt2 } from "react-icons/hi";
import Link from "next/link";

export default function UserMenuButton() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);
  const { data: session } = useSession();

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
        className="flex items-center border border-premium-borderColor dark:border-premium-borderColorHover rounded-full px-4 py-2 hover:shadow-lg transition-shadow focus:outline-none bg-premium-background dark:bg-premium-secondaryLight text-premium-secondary dark:text-premium-textPrimary"
        type="button"
      >
        <HiMenuAlt2 className="w-5 h-5 mr-2" />
        <FaUserCircle className="w-6 h-6" />
      </button>

      {isDropdownOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-premium-background dark:bg-premium-secondary border border-premium-borderColor dark:border-darkBorderColor rounded-md shadow-lg z-20">
          <ul className="py-1">
            {!session ? (
              <>
                <li className="px-4 py-2 hover:bg-premium-backgroundLight dark:hover:bg-premium-secondary-light cursor-pointer">
                  <Link href="/login" onClick={() => setIsDropdownOpen(false)}>
                    Iniciar Sesión
                  </Link>
                </li>
                <li className="px-4 py-2 hover:bg-premium-backgroundLight dark:hover:bg-premium-secondary-light cursor-pointer">
                  <Link
                    href="/login/register"
                    onClick={() => setIsDropdownOpen(false)}
                  >
                    Regístrate
                  </Link>
                </li>
              </>
            ) : (
              <li className="px-4 py-2 hover:bg-premium-backgroundLight dark:hover:bg-premium-secondary-light cursor-pointer">
                <button
                  onClick={() => {
                    setIsDropdownOpen(false);
                    signOut({ callbackUrl: "/" });
                  }}
                  className="w-full text-left"
                >
                  Cerrar Sesión
                </button>
              </li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
}
