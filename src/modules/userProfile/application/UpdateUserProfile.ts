import { UserProfileRepository } from "../domain/UserProfileRepository";

export class UpdateUserProfile {
  constructor(private readonly repository: UserProfileRepository) {}

  async execute(
    userId: number,
    input: {
      identityDocument?: string;
      names?: string;
      lastnames?: string;
      birthdate?: Date | null;
      phoneNumber?: string;
      genderId?: number | null;
    }
  ): Promise<void> {
    await this.repository.updateProfile(userId, input);
  }
}
