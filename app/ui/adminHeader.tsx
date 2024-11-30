"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import UserMenuButton from "./login/userMenuButton";

export default function AdminHeader() {
  const pathname = usePathname();

  const menuItems = [
    { path: "/admin/proyectos", label: "Proyectos" },
    { path: "/admin/viviendas", label: "Viviendas" },
    { path: "/admin/estadias", label: "Estadías" },
    { path: "/admin/reservas", label: "Reservas" },
    { path: "/admin/usuarios", label: "Usuarios" },
  ];

  return (
    <motion.header
      className="fixed top-0 left-0 z-30 w-full bg-background dark:bg-secondaryDark bg-opacity-90 shadow-md text-textPrimary dark:text-textPrimary transition-colors duration-300"
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
    >
      <div className="container mx-auto flex items-center justify-between py-4 lg:py-1 px-4">
        {/* Logo */}
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

        {/* Navigation Menu */}
        <nav
          className="hidden md:flex space-x-6"
          aria-label="Navegación de administrador"
        >
          {menuItems.map(({ path, label }) => (
            <div key={path} className="relative group">
              <Link
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
              {/* Línea horizontal animada */}
              <span
                className="absolute left-0 bottom-0 h-[2px] w-0 bg-primary dark:bg-primaryLight transition-all duration-300 group-hover:w-full"
              ></span>
            </div>
          ))}
        </nav>

        {/* User Menu */}
        <div className="flex items-center space-x-4">
          <UserMenuButton />
        </div>
      </div>
    </motion.header>
  );
}
