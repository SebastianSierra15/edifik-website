import { GetMembershipsRepository } from "../domain/MembershipRepository";

export class GetMemberships {
  constructor(private readonly repo: GetMembershipsRepository) {}

  async execute(params: {
    page: number;
    pageSize: number;
    searchTerm?: string | null;
  }) {
    return this.repo.getAll(params);
  }
}
