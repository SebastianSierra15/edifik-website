import { BadRequestError } from "@/src/shared";
import { PasswordRepository } from "../domain/PasswordRepository";
import { PasswordHasher } from "../domain/Password";

export class ChangePassword {
  constructor(
    private readonly repo: PasswordRepository,
    private readonly hasher: PasswordHasher
  ) {}

  async execute(userId: number, currentPassword: string, newPassword: string) {
    if (!currentPassword || !newPassword) {
      throw new BadRequestError("Todos los campos son obligatorios");
    }

    const storedHash = await this.repo.getUserPasswordHash(userId);

    const valid = await this.hasher.compare(currentPassword, storedHash);

    if (!valid) {
      throw new BadRequestError("La contraseña actual no es correcta");
    }

    const newHash = await this.hasher.hash(newPassword);
    await this.repo.changePassword(userId, newHash);

    return { message: "Contraseña actualizada correctamente" };
  }
}
