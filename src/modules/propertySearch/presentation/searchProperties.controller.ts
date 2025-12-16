import { SearchProperties } from "../application/SearchProperties";
import { MysqlPropertySearchRepository } from "../infrastructure/MysqlPropertySearchRepository";
import { PropertySearchFilters } from "../domain/PropertySearchFilters";

export async function searchPropertiesController(
  filters: PropertySearchFilters
) {
  const useCase = new SearchProperties(new MysqlPropertySearchRepository());

  return useCase.execute(filters);
}
