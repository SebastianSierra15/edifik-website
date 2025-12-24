import { apiClient } from "@/src/lib";

export interface CreateProjectMediaInput {
  url: string;
  tag: string;
  projectId: number;
  description?: string | null;
  commonAreaId?: number | null;
  imageTypeId?: number | null;
}

export interface UpdateProjectMediaInput {
  id: number;
  tag: string;
  description?: string | null;
}

export interface DeleteProjectMediaInput {
  mediaIds: number[];
}

export class ProjectMediaService {
  static async create(projectMedia: CreateProjectMediaInput[]): Promise<void> {
    await apiClient.post<void, { projectMedia: CreateProjectMediaInput[] }>(
      "/api/projects/metadata/project-media",
      { projectMedia }
    );
  }

  static async update(projectMedia: UpdateProjectMediaInput[]): Promise<void> {
    await apiClient.put<void, { projectMedia: UpdateProjectMediaInput[] }>(
      "/api/projects/metadata/project-media",
      { projectMedia }
    );
  }

  static async delete(mediaIds: number[]): Promise<void> {
    await apiClient.delete<void>("/api/projects/metadata/project-media", {
      mediaIds,
    });
  }
}
