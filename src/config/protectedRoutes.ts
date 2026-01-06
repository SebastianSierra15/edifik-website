import { Permission } from "../modules/auth/domain/Permission";

export type ProtectedRouteConfig = {
  permissions: Permission[] | null;
};

export const PROTECTED_ROUTES: Record<string, ProtectedRouteConfig> = {
  "/admin": {
    permissions: [
      Permission.ManageProjects,
      Permission.ManageProperties,
      Permission.ManageUsers,
      Permission.ManageRoles,
      Permission.ManageMemberships,
      Permission.ManageRequests,
    ],
  },

  "/admin/proyectos": { permissions: [Permission.ManageProjects] },
  "/admin/inmobiliaria": { permissions: [Permission.ManageProperties] },
  "/admin/usuarios": { permissions: [Permission.ManageUsers] },
  "/admin/roles": { permissions: [Permission.ManageRoles] },
  "/admin/membresias": { permissions: [Permission.ManageMemberships] },
  "/admin/solicitudes": { permissions: [Permission.ManageRequests] },

  "/usuario": { permissions: null },
  "/usuario/perfil": { permissions: null },
  "/usuario/mis-propiedades": {
    permissions: [Permission.ManageOwnProperties],
  },
  "/usuario/subir-propiedad": {
    permissions: [Permission.ManageOwnProperties],
  },

  "/membresias": { permissions: null },

  "/auth/login": { permissions: null },
  "/auth/register": { permissions: null },
  "/auth/forgot-password": { permissions: null },
};
