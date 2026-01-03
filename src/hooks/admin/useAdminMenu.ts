import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import {
  Building2,
  House,
  Users,
  ShieldCheck,
  Tag,
  ClipboardList,
} from "lucide-react";

export interface AdminMenuItem {
  path: string;
  label: string;
  icon: React.ElementType;
  permission: string;
  isActive: boolean;
}

export function useAdminMenu() {
  const { data: session } = useSession();
  const pathname = usePathname();

  const permissions = session?.user?.permissions ?? [];

  const items: Omit<AdminMenuItem, "isActive">[] = [
    {
      path: "/admin/proyectos",
      label: "Proyectos",
      icon: Building2,
      permission: "Gestionar proyectos",
    },
    {
      path: "/admin/inmobiliaria",
      label: "Inmobiliaria",
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

  const filteredItems: AdminMenuItem[] = items
    .filter((item) => permissions.some((perm) => perm.name === item.permission))
    .map((item) => ({
      ...item,
      isActive: pathname.startsWith(item.path),
    }));

  const canManageRequests = permissions.some(
    (perm) => perm.name === "Gestionar solicitudes"
  );

  return {
    menuItems: filteredItems,
    canManageRequests,
  };
}
