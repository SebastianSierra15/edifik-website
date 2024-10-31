"use client";

import Link from "next/link";
import {
  FaBuilding,
  FaProjectDiagram,
  FaBed,
  FaClipboardList,
  FaUsers,
} from "react-icons/fa";

export default function Page() {
  return (
    <div className="container mx-auto py-12 px-4 bg-background dark:bg-background">
      <h1 className="mb-10 mt-20 lg:mt-16 text-center text-4xl font-semibold text-primary dark:text-primaryLight">
        Bienvenido al Panel de Administración de EdifiK
      </h1>

      <div className="grid gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {[
          {
            href: "/admin/propiedades",
            icon: FaBuilding,
            title: "Propiedades",
            description:
              "Administra todas las propiedades disponibles en venta, arriendo, o sobre planos.",
          },
          {
            href: "/admin/proyectos",
            icon: FaProjectDiagram,
            title: "Proyectos",
            description:
              "Gestiona los proyectos actuales y futuros de la empresa constructora.",
          },
          {
            href: "/admin/estadias",
            icon: FaBed,
            title: "Estadías",
            description:
              "Controla las estadías disponibles para reserva y gestión de alquileres temporales.",
          },
          {
            href: "/admin/reservas",
            icon: FaClipboardList,
            title: "Reservas",
            description:
              "Revisa y gestiona todas las reservas realizadas por los clientes.",
          },
          {
            href: "/admin/usuarios",
            icon: FaUsers,
            title: "Usuarios",
            description:
              "Gestiona los usuarios registrados y sus roles dentro del sistema.",
          },
        ].map(({ href, icon: Icon, title, description }) => (
          <Link key={href} href={href}>
            <div className="p-6 text-center h-full bg-backgroundAlt dark:bg-secondaryLight rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 hover:bg-backgroundLight dark:hover:bg-secondaryDark">
              <Icon
                size={40}
                className="mx-auto mb-4 text-primary dark:text-primaryLight"
              />
              <h2 className="text-2xl font-semibold text-textPrimary dark:text-textPrimary">
                {title}
              </h2>
              <p className="mt-2 text-textSecondary dark:text-textSecondary">
                {description}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
