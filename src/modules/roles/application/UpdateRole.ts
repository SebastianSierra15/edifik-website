import { BadRequestError } from "@/src/shared";
import { UpdateRoleRepository } from "../domain/RoleRepository";

export class UpdateRole {
  constructor(private readonly repo: UpdateRoleRepository) {}

  async execute(input: {
    id: number;
    name: string;
    permissions: number[];
    userId: number;
  }) {
    const { id, name, permissions, userId } = input;

    if (!id || !name || !permissions) {
      throw new BadRequestError("Faltan datos obligatorios");
    }

    await this.repo.update({
      id,
      name,
      permissions,
      updatedBy: userId,
    });

    return { message: "Rol actualizado exitosamente" };
  }
}
