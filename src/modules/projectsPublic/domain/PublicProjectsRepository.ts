import { ProjectView } from "@/src/interfaces";

export interface GetPublicProjectsRepository {
  getAll(): Promise<{
    projects: ProjectView[];
    total: number;
  }>;
}
