import { Role, Permission } from "@/src/interfaces";

export interface GetRolesRepository {
  getAll(params: {
    page: number;
    pageSize: number;
    searchTerm?: string | null;
  }): Promise<{
    roles: (Role & { permissions: Permission[] })[];
    total: number;
  }>;
}

export interface CreateRoleRepository {
  create(data: {
    name: string;
    permissions: Permission[];
    createdBy: number;
  }): Promise<void>;
}

export interface UpdateRoleRepository {
  update(data: {
    id: number;
    name: string;
    permissions: Permission[];
    updatedBy: number;
  }): Promise<void>;
}

export interface DeleteRoleRepository {
  delete(data: { id: number; deletedBy: number }): Promise<void>;
}

export interface PermissionRepository {
  getAll(): Promise<Permission[]>;
}
