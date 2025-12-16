import { apiClient } from "@/src/lib";
import type { ProjectOwner } from "@/src/interfaces";

export interface GetOwnerResponse {
  user: ProjectOwner | null;
}

export class ProjectOwnerService {
  static async getOwnerByEmail(email: string): Promise<GetOwnerResponse> {
    const query = new URLSearchParams({ email });
    return apiClient.get<GetOwnerResponse>(
      `/api/projects/owner?${query.toString()}`
    );
  }
}
