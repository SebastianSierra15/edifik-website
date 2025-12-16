import { BadRequestError } from "@/src/shared";
import { UserRepository } from "../domain/UserRepository";
import { CreateUserInput } from "../domain/CreateUserInput";

export class CreateUser {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(input: CreateUserInput): Promise<void> {
    if (!input.names || !input.lastnames || !input.email) {
      throw new BadRequestError(
        "Nombres, apellidos y correo electrónico son obligatorios"
      );
    }

    await this.userRepository.create(input);
  }
}
