import { UserProfileRepository } from "../domain/UserProfileRepository";

export class GetUserProfile {
  constructor(private readonly repository: UserProfileRepository) {}

  async execute(userId: number) {
    if (!userId || userId <= 0) {
      throw new Error("Usuario inválido");
    }

    return this.repository.getProfile(userId);
  }
}
