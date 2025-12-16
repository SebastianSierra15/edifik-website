import { ProjectView } from "@/src/interfaces";
import { PropertySearchQuery } from "./PropertySearchQuery";

export interface PropertySearchRepository {
  search(
    query: PropertySearchQuery
  ): Promise<{ projects: ProjectView[]; total: number }>;
}
