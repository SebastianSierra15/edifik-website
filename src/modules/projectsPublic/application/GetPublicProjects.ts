import { GetPublicProjectsRepository } from "../domain/PublicProjectsRepository";

export class GetPublicProjects {
  constructor(private readonly repo: GetPublicProjectsRepository) {}

  async execute() {
    return this.repo.getAll();
  }
}
