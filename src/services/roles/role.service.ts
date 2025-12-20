import { apiClient } from "@/src/lib";
import { RoleWithPermissions, Permission, RoleWrite } from "@/src/interfaces";

export interface GetRolesParams {
  page: number;
  pageSize: number;
  searchTerm?: string;
}

export interface GetRolesResponse {
  roles: RoleWithPermissions[];
  totalEntries: number;
}

export class RoleService {
  static async getRoles(params: GetRolesParams): Promise<GetRolesResponse> {
    const query = new URLSearchParams({
      page: params.page.toString(),
      pageSize: params.pageSize.toString(),
      ...(params.searchTerm ? { searchTerm: params.searchTerm } : {}),
    });

    return apiClient.get<GetRolesResponse>(`/api/roles?${query.toString()}`);
  }

  static async getPermissions(): Promise<Permission[]> {
    const { permissions } = await apiClient.get<{
      permissions: Permission[];
    }>("/api/roles/permissions");

    return permissions;
  }

  static async createRole(payload: RoleWrite): Promise<void> {
    await apiClient.post<void, RoleWrite>("/api/roles", payload);
  }

  static async updateRole(payload: RoleWrite): Promise<void> {
    await apiClient.put<void, RoleWrite>("/api/roles", payload);
  }

  static async deleteRole(roleId: number): Promise<void> {
    await apiClient.delete<void, { id: number }>("/api/roles", {
      id: roleId,
    });
  }
}
