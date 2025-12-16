import { ProjectOwner } from "@/src/interfaces";

export interface GetProjectOwnerByEmailRepository {
  findByEmail(email: string): Promise<ProjectOwner | null>;
}
