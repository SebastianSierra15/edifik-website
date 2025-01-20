"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import UserMenuButton from "../login/userMenuButton";

export default function AdminHeader() {
  const { data: session } = useSession();
  const pathname = usePathname();

  const menuItems = [
    {
      path: "/admin/proyectos",
      label: "Proyectos",
      permission: "Gestionar proyectos",
    },
    {
      path: "/admin/propiedades",
      label: "Propiedades",
      permission: "Gestionar propiedades",
    },
    {
      path: "/admin/usuarios",
      label: "Usuarios",
      permission: "Gestionar usuarios",
    },
    { path: "/admin/roles", label: "Roles", permission: "Gestionar roles" },
    {
      path: "/admin/membresias",
      label: "Membresías",
      permission: "Gestionar membresías",
    },
    {
      path: "/admin/peticiones",
      label: "Peticiones",
      permission: "Gestionar peticiones",
    },
  ];

  const userPermissions = session?.user?.permissions || [];
  const filteredMenuItems = menuItems.filter(({ permission }) =>
    userPermissions.some((perm) => perm.name === permission)
  );

  const getLinkClasses = (path: string) =>
    pathname.startsWith(path)
      ? "text-premium-primary dark:text-premium-primaryLight font-semibold"
      : "text-premium-textPrimary dark:text-premium-textSecondary hover:text-premium-primary dark:hover:text-premium-primaryLight";

  return (
    <header className="fixed left-0 top-0 z-30 min-h-16 w-full bg-premium-background bg-opacity-90 text-premium-textPrimary shadow-md dark:bg-premium-secondaryDark dark:text-premium-textPrimary flex items-center justify-between py-1 px-4">
      <Link
        href="/admin"
        className={`flex flex-col items-center text-center transition-colors duration-300 ${getLinkClasses(
          "/admin"
        )}`}
      >
        <div className="flex items-center justify-start w-[100px] h-[40px]">
          <Image
            src="/images/logo.webp"
            alt="Logo de EdifiK"
            width={100}
            height={40}
            style={{ width: "100%", height: "auto" }}
            priority
          />
        </div>
        <span className="mt-1">Admin Panel</span>
      </Link>

      <nav
        className="hidden md:flex flex-1 justify-center space-x-6 items-center min-h-9"
        aria-label="Navegación de administrador"
      >
        {filteredMenuItems.length > 0 ? (
          filteredMenuItems.map(({ path, label }) => (
            <Link
              key={path}
              href={path}
              className={`group relative transition-colors duration-300 ${getLinkClasses(
                path
              )}`}
            >
              {label}
              <span
                className={`absolute bottom-0 left-0 h-[2px] bg-premium-primary transition-all duration-300 dark:bg-premium-primaryLight ${
                  pathname.startsWith(path)
                    ? "w-full"
                    : "w-0 group-hover:w-full"
                }`}
              ></span>
            </Link>
          ))
        ) : (
          <div className="flex items-center justify-center w-full text-premium-textSecondary">
            <p>Cargando menú...</p>
          </div>
        )}
      </nav>

      <div className="flex items-center justify-end space-x-4">
        <UserMenuButton />
      </div>
    </header>
  );
}
