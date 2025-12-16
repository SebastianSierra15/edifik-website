import { UserEmailRepository } from "../domain/UserRepository";

export class SearchUserEmails {
  constructor(private readonly repository: UserEmailRepository) {}

  async execute(searchTerm: string): Promise<{ id: number; email: string }[]> {
    const term = searchTerm?.trim();
    if (!term) return [];

    return this.repository.searchByEmail(term.toLowerCase());
  }
}
