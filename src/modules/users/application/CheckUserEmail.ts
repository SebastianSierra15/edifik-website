import { UserEmailCheckerRepository } from "../domain/UserRepository";

export class CheckUserEmail {
  constructor(private readonly repository: UserEmailCheckerRepository) {}

  async execute(email: string) {
    if (!email || !email.trim()) {
      throw new Error("Debe proporcionar un correo electrónico.");
    }

    return this.repository.check(email.trim());
  }
}
