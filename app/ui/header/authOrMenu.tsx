"use client";

import { useState, useEffect, useRef } from "react";
import DropdownMenu from "./dropDownMenu";
import UserMenu from "./userMenu";
import SidebarMenu from "./sideBarMenu";

export default function AuthOrMenu() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const toggleDropdown = () => {
    if (window.innerWidth >= 768) {
      setIsDropdownOpen((prev) => !prev);
    } else {
      setIsSidebarOpen(true);
    }
  };

  const toggleSidebar = () => {
    console.log("Toggling Sidebar:", !isSidebarOpen);
    setIsSidebarOpen((prev) => !prev);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div ref={menuRef} className="relative inline-block text-left">
      <UserMenu toggleMenu={toggleDropdown} toggleSidebar={toggleSidebar} />

      <SidebarMenu isOpen={isSidebarOpen} onClose={toggleSidebar} />

      {isDropdownOpen && window.innerWidth >= 768 && (
        <DropdownMenu onClose={toggleDropdown} />
      )}
    </div>
  );
}
