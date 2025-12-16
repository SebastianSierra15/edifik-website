import { BadRequestError } from "@/src/shared";
import { DeleteRoleRepository } from "../domain/RoleRepository";

export class DeleteRole {
  constructor(private readonly repo: DeleteRoleRepository) {}

  async execute(input: { id: number; userId: number }) {
    if (!input.id) {
      throw new BadRequestError("El ID del rol es obligatorio");
    }

    await this.repo.delete({
      id: input.id,
      deletedBy: input.userId,
    });

    return { message: "Rol eliminado exitosamente" };
  }
}
