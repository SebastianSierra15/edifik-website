import { apiClient } from "@/src/lib";
import type { ProjectView } from "@/src/interfaces";

export interface GetBasicProjectsResponse {
  projects: ProjectView[];
  totalEntries: number;
}

export class ProjectPublicService {
  static async getBasicProjects(): Promise<GetBasicProjectsResponse> {
    return apiClient.get<GetBasicProjectsResponse>("/api/projects/basic");
  }
}
