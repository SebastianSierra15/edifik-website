"use client";

import { useState, useEffect, useRef } from "react";
import { FaUserCircle } from "react-icons/fa";
import { HiMenuAlt2 } from "react-icons/hi";
import Link from "next/link";
import ThemeSelector from "./themeSelector";

export default function UserMenuButton() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);

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
        className="flex items-center border border-borderColor dark:border-borderColorHover rounded-full px-4 py-2 hover:shadow-lg transition-shadow focus:outline-none bg-background dark:bg-secondaryLight text-secondary dark:text-textPrimary"
        type="button"
      >
        <HiMenuAlt2 className="w-5 h-5 mr-2" />
        <FaUserCircle className="w-6 h-6" />
      </button>

      {isDropdownOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-background dark:bg-secondary border border-borderColor dark:border-darkBorderColor rounded-md shadow-lg z-20">
          <ul className="py-1">
            <li className="px-4 py-2 hover:bg-backgroundLight dark:hover:bg-secondary-light cursor-pointer">
              <Link href="/login" onClick={() => setIsDropdownOpen(false)}>
                Iniciar Sesión
              </Link>
            </li>
            <li className="px-4 py-2 hover:bg-backgroundLight dark:hover:bg-secondary-light cursor-pointer">
              <Link
                href="/login/register"
                onClick={() => setIsDropdownOpen(false)}
              >
                Regístrate
              </Link>
            </li>
            <hr className="my-2 border-borderColor dark:border-darkBorderColor" />
            <li>
              <ThemeSelector closeMenu={() => setIsDropdownOpen(false)} />
            </li>
          </ul>
        </div>
      )}
    </div>
  );
}
