import { BadRequestError } from "@/src/shared";
import { CreateRoleRepository } from "../domain/RoleRepository";

export class CreateRole {
  constructor(private readonly repo: CreateRoleRepository) {}

  async execute(input: {
    name: string;
    permissions: number[];
    userId: number;
  }) {
    const { name, permissions, userId } = input;

    if (!name || !permissions?.length) {
      throw new BadRequestError("Faltan datos obligatorios");
    }

    await this.repo.create({
      name,
      permissions,
      createdBy: userId,
    });

    return { message: "Rol creado exitosamente" };
  }
}
