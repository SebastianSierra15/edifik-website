import { GetRequestsRepository } from "../domain/RequestRepository";

export class GetRequests {
  constructor(private readonly repo: GetRequestsRepository) {}

  async execute(params: {
    page: number;
    pageSize: number;
    searchTerm?: string | null;
  }) {
    return this.repo.getAll(params);
  }
}
