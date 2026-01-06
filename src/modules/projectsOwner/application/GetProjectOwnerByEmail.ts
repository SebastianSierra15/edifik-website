import { BadRequestError } from "@/src/shared";
import { GetProjectOwnerByEmailRepository } from "../domain/ProjectOwnerRepository";

export class GetProjectOwnerByEmail {
  constructor(private readonly repo: GetProjectOwnerByEmailRepository) {}

  async execute(email: string | null) {
    if (!email) {
      throw new BadRequestError("Debe proporcionar un correo electrónico");
    }

    if (!email.includes("@")) {
      throw new BadRequestError("Correo electrónico inválido");
    }

    const owner = await this.repo.findByEmail(email);

    if (!owner) {
      throw new BadRequestError("Usuario no encontrado");
    }

    return { user: owner };
  }
}
