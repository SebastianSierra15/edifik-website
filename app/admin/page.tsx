"use client";

import { useSession } from "next-auth/react";
import dynamic from "next/dynamic";
import SkeletonAdminCard from "../ui/admin/skeletons/skeletonAdminCard";

const AdminCard = dynamic(() => import("../ui/admin/adminCard"), {
  ssr: false,
});

const Building2 = dynamic(() =>
  import("lucide-react").then((mod) => mod.Building2)
);
const House = dynamic(() => import("lucide-react").then((mod) => mod.House));
const Users = dynamic(() => import("lucide-react").then((mod) => mod.Users));
const ShieldCheck = dynamic(() =>
  import("lucide-react").then((mod) => mod.ShieldCheck)
);
const Tag = dynamic(() => import("lucide-react").then((mod) => mod.Tag));
const ClipboardList = dynamic(() =>
  import("lucide-react").then((mod) => mod.ClipboardList)
);

export default function Page() {
  const { data: session, status } = useSession();

  const cards = [
    {
      href: "/admin/proyectos",
      icon: Building2,
      title: "Proyectos",
      description:
        "Administra y gestiona todos los proyectos en desarrollo, incluyendo información y detalles de cada proyecto.",
      permission: "Gestionar proyectos",
    },
    {
      href: "/admin/propiedades",
      icon: House,
      title: "Propiedades",
      description:
        "Gestiona las propiedades disponibles para venta y arriendo, incluyendo tipos de vivienda y características.",
      permission: "Gestionar propiedades",
    },
    {
      href: "/admin/usuarios",
      icon: Users,
      title: "Usuarios",
      description: "Gestiona los usuarios registrados en la plataforma.",
      permission: "Gestionar usuarios",
    },
    {
      href: "/admin/roles",
      icon: ShieldCheck,
      title: "Roles",
      description: "Administra los roles, permisos y accesos de los usuarios.",
      permission: "Gestionar roles",
    },
    {
      href: "/admin/membresias",
      icon: Tag,
      title: "Membresías",
      description:
        "Gestiona las membresías disponibles para usuarios y propiedades, incluyendo niveles y beneficios.",
      permission: "Gestionar membresías",
    },
    {
      href: "/admin/peticiones",
      icon: ClipboardList,
      title: "Peticiones",
      description:
        "Revisa y gestiona las solicitudes de los usuarios relacionadas con propiedades.",
      permission: "Gestionar peticiones",
    },
  ];

  const userPermissions = session?.user?.permissions || [];
  const filteredCards =
    status === "authenticated"
      ? cards.filter((card) =>
          userPermissions.some((perm) => perm.name === card.permission)
        )
      : [];

  return (
    <div className="container mx-auto min-h-[calc(100vh-200px)] bg-premium-background px-4 py-12 dark:bg-premium-background">
      <h1 className="mb-10 mt-20 text-center text-4xl font-semibold text-premium-primary lg:mt-16 dark:text-premium-primaryLight min-h-[4rem]">
        Bienvenido al Panel de Administración de EdifiK
      </h1>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
        {status === "loading" &&
          cards.map((_, index) => (
            <div
              key={index}
              className="min-h-[200px] bg-premium-backgroundAlt dark:bg-premium-secondaryLight rounded-lg"
            >
              <SkeletonAdminCard />
            </div>
          ))}

        {status === "authenticated" &&
          filteredCards.map(({ href, icon: Icon, title, description }) => (
            <div
              key={href}
              className="min-h-[200px] bg-premium-backgroundAlt dark:bg-premium-secondaryLight rounded-lg"
            >
              <AdminCard
                href={href}
                Icon={Icon}
                title={title}
                description={description}
              />
            </div>
          ))}
      </div>
    </div>
  );
}
