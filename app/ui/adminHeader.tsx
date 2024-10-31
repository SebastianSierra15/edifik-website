"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import UserMenuButton from "./login/userMenuButton";

export default function AdminHeader() {
  const pathname = usePathname();

  const menuItems = [
    { path: "/admin/propiedades", label: "Propiedades" },
    { path: "/admin/proyectos", label: "Proyectos" },
    { path: "/admin/estadias", label: "Estadías" },
    { path: "/admin/reservas", label: "Reservas" },
    { path: "/admin/usuarios", label: "Usuarios" },
  ];

  return (
    <header className="fixed top-0 left-0 z-30 w-full bg-background dark:bg-secondaryDark bg-opacity-90 backdrop-blur-md shadow-md text-textPrimary dark:text-textPrimary transition-colors duration-300">
      <div className="container mx-auto flex items-center justify-between py-4 lg:py-1 px-4">
        {/* Logo de EdifiK */}
        <Link
          href="/admin"
          className={`flex flex-col items-center text-center transition-colors duration-300 ${
            pathname === "/admin"
              ? "text-primary dark:text-primaryLight font-semibold"
              : "text-textPrimary dark:text-textSecondary hover:text-primary dark:hover:text-primaryLight"
          }`}
          aria-label="Admin Panel"
          aria-current={pathname === "/admin" ? "page" : undefined}
        >
          <Image
            src="/images/logo.png"
            alt="Logo de EdifiK"
            width={100}
            height={40}
            priority
            style={{ width: "auto", height: "auto" }}
          />
          <span className="mt-1">Admin Panel</span>
        </Link>

        {/* Navegación */}
        <nav
          className="hidden md:flex space-x-6"
          aria-label="Navegación de administrador"
        >
          {menuItems.map(({ path, label }) => (
            <Link
              key={path}
              href={path}
              className={`transition-colors duration-300 ${
                pathname.startsWith(path)
                  ? "text-primary dark:text-primaryLight font-semibold"
                  : "text-textPrimary dark:text-textSecondary hover:text-primary dark:hover:text-primaryLight"
              }`}
              aria-current={pathname.startsWith(path) ? "page" : undefined}
            >
              {label}
            </Link>
          ))}
        </nav>

        {/* Menú del Usuario */}
        <div className="flex items-center space-x-4">
          <UserMenuButton />
        </div>
      </div>
    </header>
  );
}
