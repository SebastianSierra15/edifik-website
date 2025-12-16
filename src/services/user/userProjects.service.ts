import { apiClient } from "@/src/lib";
import { ProjectSummary } from "@/src/interfaces";

export interface GetMyProjectsParams {
  page: number;
  pageSize: number;
  statusProject: number;
}

export interface GetMyProjectsResponse {
  projects: ProjectSummary[];
  totalEntries: number;
}

export class UserProjectsService {
  static async getMyProjects(
    params: GetMyProjectsParams
  ): Promise<GetMyProjectsResponse> {
    const query = new URLSearchParams({
      page: params.page.toString(),
      pageSize: params.pageSize.toString(),
      statusProject: params.statusProject.toString(),
    });

    return apiClient.get<GetMyProjectsResponse>(
      `/api/user?${query.toString()}`
    );
  }

  static async deleteProject(projectId: number): Promise<void> {
    await apiClient.delete<void>(`/api/user?id=${projectId}`);
  }
}
