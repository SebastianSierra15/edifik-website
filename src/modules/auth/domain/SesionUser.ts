import { Permission } from "./Permission";

export interface UserPermission {
  id: number;
  name: Permission | string;
}

export interface SessionUser {
  id: string;
  email?: string | null;
  name?: string | null;
  membershipId?: string;
  role?: string;
  permissions?: UserPermission[];
}
