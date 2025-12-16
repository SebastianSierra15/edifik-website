import { SearchAdminProjects } from "../application/queries/SearchAdminProjects";
import { MysqlAdminProjectsRepository } from "../infrastructure/MysqlAdminProjectsRepository";
import { AdminProjectsSearchFilters } from "../domain/AdminProjectsSearchFilters";
import { SearchAdminProjectsPolicy } from "../domain/ProjectPolicy";

export async function searchAdminProjectsController(
  filters: AdminProjectsSearchFilters,
  policy: SearchAdminProjectsPolicy
) {
  const useCase = new SearchAdminProjects(new MysqlAdminProjectsRepository());
  return useCase.execute(filters, policy);
}
