"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import UserMenuButton from "./login/userMenuButton";

export default function AdminHeader() {
  const pathname = usePathname();

  const menuItems = [
    { path: "/admin/proyectos", label: "Proyectos" },
    { path: "/admin/propiedades", label: "Propiedades" },
    { path: "/admin/usuarios", label: "Usuarios" },
    { path: "/admin/roles", label: "Roles" },
    { path: "/admin/membresias", label: "Membresías" },
    { path: "/admin/peticiones", label: "Peticiones" },
  ];

  const getLinkClasses = (path: string) =>
    pathname.startsWith(path)
      ? "text-premium-primary dark:text-premium-primaryLight font-semibold"
      : "text-premium-textPrimary dark:text-premium-textSecondary hover:text-premium-primary dark:hover:text-premium-primaryLight";

  return (
    <header className="fixed top-0 left-0 z-30 w-full bg-premium-background dark:bg-premium-secondaryDark bg-opacity-90 shadow-md text-premium-textPrimary dark:text-premium-textPrimary">
      <div className="container mx-auto flex items-center justify-between py-4 lg:py-1 px-4">
        {/* Logo */}
        <Link
          href="/admin"
          className={`flex flex-col items-center text-center transition-colors duration-300 ${getLinkClasses(
            "/admin"
          )}`}
        >
          <Image
            src="/images/logo.webp"
            alt="Logo de EdifiK"
            width={100}
            height={40}
            style={{ width: "100%", height: "auto" }}
          />
          <span className="mt-1">Admin Panel</span>
        </Link>

        {/* Navigation */}
        <nav
          className="hidden md:flex space-x-6"
          aria-label="Navegación de administrador"
        >
          {menuItems.map(({ path, label }) => (
            <Link
              key={path}
              href={path}
              className={`relative group transition-colors duration-300 ${getLinkClasses(
                path
              )}`}
            >
              {label}
              <span
                className={`absolute left-0 bottom-0 h-[2px] bg-premium-primary dark:bg-premium-primaryLight transition-all duration-300 ${
                  pathname.startsWith(path)
                    ? "w-full"
                    : "w-0 group-hover:w-full"
                }`}
              ></span>
            </Link>
          ))}
        </nav>

        {/* User menu */}
        <div className="flex items-center space-x-4">
          <UserMenuButton />
        </div>
      </div>
    </header>
  );
}
