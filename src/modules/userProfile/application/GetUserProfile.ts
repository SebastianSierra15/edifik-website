import { UserProfileRepository } from "../domain/UserProfileRepository";

export class GetUserProfile {
  constructor(private readonly repository: UserProfileRepository) {}

  async execute(userId: number) {
    return this.repository.getProfile(userId);
  }
}
