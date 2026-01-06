import { PermissionRepository } from "../domain/RoleRepository";

export class GetPermissions {
  constructor(private readonly repo: PermissionRepository) {}

  async execute() {
    return this.repo.getAll();
  }
}
