import { UserRepository } from "../domain/UserRepository";

interface UpdateUserInput {
  id: string;
  names: string;
  lastnames: string;
  email: string;
  phoneNumber?: string | null;
  genderId: number;
  roleId: number;
  membershipId?: string;
  state: boolean;
  updatedBy: string;
}

export class UpdateUser {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(input: UpdateUserInput): Promise<void> {
    if (!input.id || !input.names || !input.lastnames || !input.email) {
      throw new Error("Datos obligatorios faltantes");
    }

    await this.userRepository.update(input);
  }
}
