"use client";

import { useState, useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";

const FaUserCircle = dynamic(() =>
  import("react-icons/fa").then((mod) => mod.FaUserCircle)
);
const HiMenuAlt2 = dynamic(() =>
  import("react-icons/hi").then((mod) => mod.HiMenuAlt2)
);

export default function UserMenuButton() {
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
        className="flex items-center border border-premium-borderColor dark:border-premium-borderColorHover rounded-full px-4 py-2 hover:shadow-lg transition-shadow focus:outline-none bg-premium-background dark:bg-premium-secondaryLight text-premium-secondary dark:text-premium-textPrimary"
        type="button"
        aria-expanded={isDropdownOpen}
        aria-haspopup="menu"
      >
        <HiMenuAlt2 className="w-5 h-5 mr-2" />
        <FaUserCircle className="w-6 h-6" />
      </button>

      {isDropdownOpen && (
        <div
          className="absolute right-0 mt-2 w-48 bg-premium-background dark:bg-premium-secondary border border-premium-borderColor dark:border-darkBorderColor rounded-md shadow-lg z-20"
          role="menu"
        >
          <ul className="py-1">
            {!session ? (
              <>
                <li>
                  <Link
                    href="/login"
                    onClick={() => setIsDropdownOpen(false)}
                    className="block px-4 py-2 hover:bg-premium-backgroundLight dark:hover:bg-premium-secondaryLight cursor-pointer"
                  >
                    Iniciar Sesión
                  </Link>
                </li>
                <li>
                  <Link
                    href="/login/register"
                    onClick={() => setIsDropdownOpen(false)}
                    className="block px-4 py-2 hover:bg-premium-backgroundLight dark:hover:bg-premium-secondaryLight cursor-pointer"
                  >
                    Regístrate
                  </Link>
                </li>
              </>
            ) : (
              <li>
                <button
                  onClick={() => {
                    setIsDropdownOpen(false);
                    signOut({ callbackUrl: "/" });
                  }}
                  className="block w-full px-4 py-2 text-left hover:bg-premium-backgroundLight dark:hover:bg-premium-secondaryLight cursor-pointer"
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
