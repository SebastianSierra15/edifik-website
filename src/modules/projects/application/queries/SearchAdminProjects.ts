import { AdminProjectsRepository } from "../../domain/ProjectsRepository";
import { AdminProjectsSearchFilters } from "../../domain/AdminProjectsSearchFilters";
import { SearchAdminProjectsPolicy } from "../../domain/ProjectPolicy";

export class SearchAdminProjects {
  constructor(private readonly repo: AdminProjectsRepository) {}

  async execute(
    filters: AdminProjectsSearchFilters,
    policy: SearchAdminProjectsPolicy
  ) {
    const result = await this.repo.search(filters);

    if (!policy.canSeeOwnerEmail) {
      result.projects = result.projects.map((project) => ({
        ...project,
        email: project.email ? "Usuario Privado" : null,
      }));
    }

    return result;
  }
}
