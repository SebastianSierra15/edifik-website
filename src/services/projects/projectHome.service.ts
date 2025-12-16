import { apiClient } from "@/src/lib";
import type { ProjectView } from "@/src/interfaces";

export interface GetHomeProjectsParams {
  numberProjects: number;
  isProperty: boolean;
}

export interface GetHomeProjectsResponse {
  projects: ProjectView[];
}

export class ProjectHomeService {
  static async getHomeProjects(
    params: GetHomeProjectsParams
  ): Promise<GetHomeProjectsResponse> {
    const endpoint = params.isProperty ? "realEstate" : "company";
    const query = new URLSearchParams({
      numberProjects: String(params.numberProjects),
    });

    return apiClient.get<GetHomeProjectsResponse>(
      `/api/projects/home/${endpoint}?${query.toString()}`
    );
  }
}
