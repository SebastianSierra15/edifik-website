import { Permission } from "../../modules/auth/domain/Permission";

export function isAdmin(permissions: Permission[] = []): boolean {
  const adminPermissions = [
    Permission.ManageProjects,
    Permission.ManageProperties,
    Permission.ManageUsers,
    Permission.ManageRoles,
    Permission.ManageMemberships,
    Permission.ManageRequests,
  ];

  return adminPermissions.some((p) => permissions.includes(p));
}
