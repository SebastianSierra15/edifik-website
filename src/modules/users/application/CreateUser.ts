import { UserRepository } from "../domain/UserRepository";
import { CreateUserInput } from "../domain/CreateUserInput";

export class CreateUser {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(input: CreateUserInput): Promise<void> {
    if (!input.names || !input.lastnames || !input.email) {
      throw new Error("Datos obligatorios faltantes");
    }

    await this.userRepository.create(input);
  }
}
