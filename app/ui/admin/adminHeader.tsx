"use client";

import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import clsx from "clsx";
import Image from "next/image";
import Link from "next/link";
import {
  Building2,
  House,
  Users,
  ShieldCheck,
  Tag,
  ClipboardList,
} from "lucide-react";
import AdminMenuButton from "./adminMenuButton";

export default function AdminHeader() {
  const { data: session } = useSession();
  const pathname = usePathname();

  const menuItems = [
    {
      path: "/admin/proyectos",
      label: "Proyectos",
      icon: Building2,
      permission: "Gestionar proyectos",
    },
    {
      path: "/admin/propiedades",
      label: "Propiedades",
      icon: House,
      permission: "Gestionar propiedades",
    },
    {
      path: "/admin/usuarios",
      label: "Usuarios",
      icon: Users,
      permission: "Gestionar usuarios",
    },
    {
      path: "/admin/roles",
      label: "Roles",
      icon: ShieldCheck,
      permission: "Gestionar roles",
    },
    {
      path: "/admin/membresias",
      label: "Membresías",
      icon: Tag,
      permission: "Gestionar membresias",
    },
    {
      path: "/admin/solicitudes",
      label: "Solicitudes",
      icon: ClipboardList,
      permission: "Gestionar solicitudes",
    },
  ];

  const userPermissions = session?.user?.permissions || [];
  const filteredMenuItems = menuItems.filter(({ permission }) =>
    userPermissions.some((perm) => perm.name === permission)
  );

  const canManageRequests = userPermissions.some(
    (perm) => perm.name === "Gestionar solicitudes"
  );

  const getLinkClasses = (path: string) =>
    pathname.startsWith(path)
      ? "text-premium-primary dark:text-premium-primaryLight font-semibold"
      : "text-premium-textPrimary dark:text-premium-textSecondary hover:text-premium-primary dark:hover:text-premium-primaryLight";

  return (
    <header className="fixed space-x-3 left-0 top-0 z-50 min-h-16 w-full bg-premium-background bg-opacity-90 text-premium-textPrimary shadow-md dark:bg-premium-secondaryDark dark:text-premium-textPrimary flex items-center justify-between py-1 px-4">
      <Link
        href="/admin"
        className={clsx(
          "flex flex-col items-center text-center transition-colors duration-300",
          getLinkClasses("/admin")
        )}
      >
        <div className="flex items-center justify-start w-[100px] h-[40px]">
          <Image
            src="/images/logo.webp"
            alt="Logo de EdifiK"
            width={100}
            height={40}
            loading="lazy"
            className={clsx(
              "w-auto h-auto max-w-[100px] max-h-[40px] transition duration-300",
              "dark:bg-transparent",
              "bg-gray-800 p-1 rounded-md shadow-md"
            )}
          />
        </div>
        <span>Admin Panel</span>
      </Link>

      <nav
        className="flex-1 justify-center space-x-6 items-center min-h-9 hidden md:flex"
        aria-label="Navegación de administrador"
      >
        {filteredMenuItems.length > 0 ? (
          filteredMenuItems.map(({ path, label }) => (
            <Link
              key={path}
              href={path}
              className={clsx(
                "group relative transition-colors duration-300",
                getLinkClasses(path)
              )}
            >
              {label}
              <span
                className={clsx(
                  "absolute bottom-0 left-0 h-[2px] bg-premium-primary transition-all duration-300 dark:bg-premium-primaryLight",
                  pathname.startsWith(path)
                    ? "w-full"
                    : "w-0 group-hover:w-full"
                )}
              />
            </Link>
          ))
        ) : (
          <div className="flex items-center justify-center w-full text-premium-textSecondary">
            <p>Cargando menú...</p>
          </div>
        )}
      </nav>

      <div className="flex items-center justify-end space-x-4">
        <AdminMenuButton
          menuItems={filteredMenuItems}
          canManageRequests={canManageRequests}
        />
      </div>
    </header>
  );
}
