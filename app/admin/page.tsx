"use client";

import Link from "next/link";
import {
  FaDraftingCompass,
  FaHome,
  FaTag,
  FaClipboardList,
  FaUsers,
  FaUserShield,
} from "react-icons/fa";

export default function Page() {
  return (
    <div className="container mx-auto py-12 px-4 bg-premium-background dark:bg-premium-background">
      <h1 className="mb-10 mt-20 lg:mt-16 text-center text-4xl font-semibold text-premium-primary dark:text-premium-primaryLight">
        Bienvenido al Panel de Administración de EdifiK
      </h1>

      <div className="grid gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {[
          {
            href: "/admin/proyectos",
            icon: FaDraftingCompass,
            title: "Proyectos",
            description:
              "Administra y gestiona todos los proyectos en desarrollo, incluyendo información y detalles de cada proyecto.",
          },
          {
            href: "/admin/propiedades",
            icon: FaHome,
            title: "Propiedades",
            description:
              "Gestiona las propiedades disponibles para venta y arriendo, incluyendo tipos de vivienda y características.",
          },
          {
            href: "/admin/usuarios",
            icon: FaUsers,
            title: "Usuarios",
            description: "Gestiona los usuarios registrados en la plataforma.",
          },
          {
            href: "/admin/roles",
            icon: FaUserShield,
            title: "Roles",
            description:
              "Administra los roles, permisos y accesos de los usuarios.",
          },
          {
            href: "/admin/membresias",
            icon: FaTag,
            title: "Membresías",
            description:
              "Gestiona las membresías disponibles para usuarios y propiedades, incluyendo niveles y beneficios.",
          },
          {
            href: "/admin/peticiones",
            icon: FaClipboardList,
            title: "Peticiones",
            description:
              "Revisa y gestiona las solicitudes de los usuarios relacionadas con proyectos y propiedades.",
          },
        ].map(({ href, icon: Icon, title, description }) => (
          <Link key={href} href={href}>
            <div className="p-6 text-center h-full bg-premium-backgroundAlt dark:bg-premium-secondaryLight rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 hover:bg-premium-backgroundLight dark:hover:bg-premium-secondaryDark">
              <Icon
                size={40}
                className="mx-auto mb-4 text-premium-primary dark:text-premium-primaryLight"
              />
              <h2 className="text-2xl font-semibold text-premium-textPrimary dark:text-premium-textPrimary">
                {title}
              </h2>
              <p className="mt-2 text-premium-textSecondary dark:text-premium-textSecondary">
                {description}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
