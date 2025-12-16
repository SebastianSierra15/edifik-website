import { BadRequestError } from "@/src/shared";
import { UserEmailCheckerRepository } from "../domain/UserRepository";

export class CheckUserEmail {
  constructor(private readonly repository: UserEmailCheckerRepository) {}

  async execute(email: string) {
    if (!email || !email.trim()) {
      throw new BadRequestError("Debe proporcionar un correo electrónico.");
    }

    const normalizedEmail = email.trim().toLowerCase();

    if (!normalizedEmail.includes("@")) {
      throw new BadRequestError("El correo electrónico no es válido.");
    }

    return this.repository.check(normalizedEmail);
  }
}
