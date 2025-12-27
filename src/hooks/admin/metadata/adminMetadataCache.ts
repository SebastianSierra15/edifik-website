import type { Gender, MembershipSummary, Permission, Role } from "@/src/interfaces";
import { RoleService } from "@/src/services/roles";
import { UserService } from "@/src/services/users";

let rolesPermissionsCache: Permission[] | null = null;
let rolesPermissionsPromise: Promise<Permission[]> | null = null;

let usersMetadataCache:
  | { roles: Role[]; genders: Gender[]; memberships: MembershipSummary[] }
  | null = null;
let usersMetadataPromise:
  | Promise<{
      roles: Role[];
      genders: Gender[];
      memberships: MembershipSummary[];
    }>
  | null = null;

export function getCachedRolePermissions() {
  return rolesPermissionsCache;
}

export function fetchRolePermissions(): Promise<Permission[]> {
  if (rolesPermissionsCache) {
    return Promise.resolve(rolesPermissionsCache);
  }

  if (!rolesPermissionsPromise) {
    rolesPermissionsPromise = RoleService.getPermissions()
      .then((data) => {
        rolesPermissionsCache = data;
        return data;
      })
      .finally(() => {
        rolesPermissionsPromise = null;
      });
  }

  return rolesPermissionsPromise;
}

export function getCachedUsersMetadata() {
  return usersMetadataCache;
}

export function fetchUsersMetadata(): Promise<{
  roles: Role[];
  genders: Gender[];
  memberships: MembershipSummary[];
}> {
  if (usersMetadataCache) {
    return Promise.resolve(usersMetadataCache);
  }

  if (!usersMetadataPromise) {
    usersMetadataPromise = UserService.getUsersMetadata()
      .then((data) => {
        usersMetadataCache = data;
        return data;
      })
      .finally(() => {
        usersMetadataPromise = null;
      });
  }

  return usersMetadataPromise;
}
