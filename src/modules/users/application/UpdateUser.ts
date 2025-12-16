import { BadRequestError } from "@/src/shared";
import { UserRepository } from "../domain/UserRepository";
import { UpdateUserInput } from "../domain/UpdateUserInput";

export class UpdateUser {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(input: UpdateUserInput): Promise<void> {
    if (!input.id || !input.names || !input.lastnames || !input.email) {
      throw new BadRequestError("Datos obligatorios faltantes");
    }

    await this.userRepository.update(input);
  }
}
