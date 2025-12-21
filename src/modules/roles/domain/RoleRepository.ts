import { RoleWithPermissions, Permission } from "@/src/interfaces";

export interface GetRolesRepository {
  getAll(params: {
    page: number;
    pageSize: number;
    searchTerm?: string | null;
  }): Promise<{
    roles: RoleWithPermissions[];
    totalEntries: number;
  }>;
}

export interface CreateRoleRepository {
  create(data: {
    name: string;
    permissions: number[];
    createdBy: number;
  }): Promise<void>;
}

export interface UpdateRoleRepository {
  update(data: {
    id: number;
    name: string;
    permissions: number[];
    updatedBy: number;
  }): Promise<void>;
}

export interface DeleteRoleRepository {
  delete(data: { id: number; deletedBy: number }): Promise<void>;
}

export interface PermissionRepository {
  getAll(): Promise<Permission[]>;
}
