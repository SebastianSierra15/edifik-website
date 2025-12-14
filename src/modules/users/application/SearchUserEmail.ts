import { UserEmailRepository } from "../domain/UserRepository";

export class SearchUserEmails {
  constructor(private readonly repository: UserEmailRepository) {}

  async execute(searchTerm: string): Promise<{ id: number; email: string }[]> {
    if (!searchTerm.trim()) {
      return [];
    }

    return this.repository.searchByEmail(searchTerm.trim());
  }
}
