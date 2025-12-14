import { UsersMetadata } from "../domain/User";
import { UserMetadataRepository } from "../domain/UserRepository";

export class GetUsersMetadata {
  constructor(private readonly repository: UserMetadataRepository) {}

  async execute(): Promise<UsersMetadata> {
    return this.repository.getMetadata();
  }
}
