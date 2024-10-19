"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import UserMenuButton from "./login/userMenuButton";

export default function AdminHeader() {
  const pathname = usePathname();

  return (
    <header className="fixed top-0 left-0 z-30 w-full bg-background dark:bg-darkBackgroundLight bg-opacity-70 backdrop-blur-md shadow-md text-textPrimary dark:text-darkTextPrimary">
      <div className="container mx-auto flex items-center justify-between py-4 lg:py-1 px-4">
        <Link
          href="/admin"
          className="flex flex-col items-center text-center"
          aria-label="Admin Panel"
        >
          <Image
            src="/images/logo.png"
            alt="Logo de EdifiK"
            width={100}
            height={40}
            priority
            style={{ width: "auto", height: "auto" }}
          />
          <span className="text-base font-semibold text-textPrimary dark:text-darkTextPrimary hover:text-primary dark:hover:text-darkPrimary">
            Admin Panel
          </span>
        </Link>

        <nav
          className="hidden md:flex space-x-6"
          aria-label="Navegación de administrador"
        >
          {[
            "/admin/propiedades",
            "/admin/proyectos",
            "/admin/estadias",
            "/admin/reservas",
            "/admin/usuarios",
          ].map((path, index) => {
            const labels = [
              "Propiedades",
              "Proyectos",
              "Estadías",
              "Reservas",
              "Usuarios",
            ];
            return (
              <Link
                key={path}
                href={path}
                className={
                  pathname === path
                    ? "text-primary dark:text-darkPrimary font-semibold"
                    : "hover:text-primary dark:hover:text-darkPrimary"
                }
                aria-current={pathname === path ? "page" : undefined}
              >
                {labels[index]}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center space-x-4 text-textPrimary dark:text-darkTextPrimary">
          <UserMenuButton />
        </div>
      </div>
    </header>
  );
}
