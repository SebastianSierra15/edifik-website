import { GetRolesRepository } from "../domain/RoleRepository";

export class GetRoles {
  constructor(private readonly repo: GetRolesRepository) {}

  async execute(params: {
    page: number;
    pageSize: number;
    searchTerm?: string | null;
  }) {
    return this.repo.getAll(params);
  }
}
