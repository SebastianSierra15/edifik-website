"use client";

import { useSession } from "next-auth/react";
import {
  Building2,
  House,
  Users,
  ShieldCheck,
  Tag,
  ClipboardList,
} from "lucide-react";
import { AdminDashboardView } from "./AdminDashboard.view";
import type { UserPermission } from "@/src/modules/auth";

interface DashboardCardConfig {
  href: string;
  title: string;
  description: string;
  permission: string;
  Icon: React.ElementType;
}

export function AdminDashboardContainer() {
  const { data: session, status } = useSession();

  const cards: DashboardCardConfig[] = [
    {
      href: "/admin/proyectos",
      Icon: Building2,
      title: "Proyectos",
      description:
        "Administra y gestiona todos los proyectos en desarrollo, incluyendo información y detalles de cada proyecto.",
      permission: "Gestionar proyectos",
    },
    {
      href: "/admin/inmobiliaria",
      Icon: House,
      title: "Inmobiliaria",
      description:
        "Gestiona las propiedades disponibles para venta y arriendo, incluyendo tipos de vivienda y características.",
      permission: "Gestionar propiedades",
    },
    {
      href: "/admin/usuarios",
      Icon: Users,
      title: "Usuarios",
      description: "Gestiona los usuarios registrados en la plataforma.",
      permission: "Gestionar usuarios",
    },
    {
      href: "/admin/roles",
      Icon: ShieldCheck,
      title: "Roles",
      description: "Administra los roles, permisos y accesos de los usuarios.",
      permission: "Gestionar roles",
    },
    {
      href: "/admin/membresias",
      Icon: Tag,
      title: "Membresías",
      description:
        "Gestiona las membresías disponibles para usuarios y propiedades.",
      permission: "Gestionar membresias",
    },
    {
      href: "/admin/solicitudes",
      Icon: ClipboardList,
      title: "Solicitudes",
      description:
        "Revisa y gestiona las solicitudes de los usuarios relacionadas con propiedades.",
      permission: "Gestionar solicitudes",
    },
  ];

  const userPermissions: UserPermission[] = session?.user?.permissions ?? [];

  const filteredCards =
    status === "authenticated"
      ? cards.filter((card) =>
          userPermissions.some((perm) => perm.name === card.permission)
        )
      : [];

  return (
    <AdminDashboardView
      status={status}
      cards={filteredCards}
      skeletonCount={cards.length}
    />
  );
}
