import { ProjectSummary } from "@/src/interfaces";

export interface GetUserProjectsParams {
  userId: number;
  page: number;
  pageSize: number;
  statusProject: number;
}

export interface GetUserProjectsResult {
  projects: ProjectSummary[];
  totalEntries: number;
}

export interface UserProjectsRepository {
  getUserProjects(
    params: GetUserProjectsParams
  ): Promise<GetUserProjectsResult>;
  deleteUserProject(params: {
    projectId: number;
    userId: number;
  }): Promise<void>;
}
