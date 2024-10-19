"use client";

import { useState, useEffect, useRef } from "react";
import { FaUserCircle } from "react-icons/fa";
import { HiMenuAlt2 } from "react-icons/hi";
import Link from "next/link";

export default function UserMenuButton() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null); // Referencia para el menú desplegable

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

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
        className="flex items-center border border-gray-300 rounded-full px-4 py-2 hover:shadow-lg focus:outline-none"
        type="button"
      >
        <HiMenuAlt2 className="text-gray-600 w-5 h-5 mr-2" />
        <FaUserCircle className="text-gray-600 w-6 h-6" />
      </button>

      {isDropdownOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-20">
          <ul className="py-1">
            <li className="flex items-center px-4 py-2 hover:bg-gray-100 cursor-pointer">
              <Link href="/login" onClick={() => setIsDropdownOpen(false)}>
                Iniciar Sesión
              </Link>
            </li>
            <li className="flex items-center px-4 py-2 hover:bg-gray-100 cursor-pointer">
              <Link
                href="/login/register"
                onClick={() => setIsDropdownOpen(false)}
              >
                Regístrate
              </Link>
            </li>
            <hr />
            <li className="flex items-center px-4 py-2 hover:bg-gray-100 cursor-pointer">
              <Link href="#">Subir propiedad</Link>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
}
