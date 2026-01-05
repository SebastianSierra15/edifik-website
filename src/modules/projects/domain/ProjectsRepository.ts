import {
  ProjectSummary,
  ProjectDetails,
  ProjectsMetadata,
  ProjectsBasicMetadata,
  ProjectsCitiesMetadata,
  ProjectView,
  ImageType,
} from "@/src/interfaces";
import { AdminProjectsSearchFilters } from "./AdminProjectsSearchFilters";
import { ProjectUpdateInput } from "./ProjectUpdateInput";
import { ProjectCreateInput } from "./ProjectCreateInput";
import { ProjectMediaInput } from "./ProjectMediaInput";

export interface AdminProjectsRepository {
  search(
    filters: AdminProjectsSearchFilters
  ): Promise<{ projects: ProjectSummary[]; totalEntries: number }>;
}

export interface UpdateProjectRepository {
  updateProject(
    input: ProjectUpdateInput & {
      state: string;
      ownerId: number | null;
    }
  ): Promise<void>;
}

export interface CreateProjectRepository {
  createProject(
    input: ProjectCreateInput & {
      state: string;
      ownerId: number | null;
    }
  ): Promise<number>;
}

export interface DeleteProjectStateRepository {
  deleteState(projectId: number, userId: number): Promise<void>;
}

export interface DeleteProjectPermanentlyRepository {
  deletePermanently(projectId: number, userId: number): Promise<void>;
}

export interface GetProjectByIdRepository {
  getById(params: {
    projectId: number;
    isProject: number;
    isAdmin: number;
    canSeeMembership: boolean;
    ownerId?: number | null;
  }): Promise<ProjectDetails | null>;
}

export interface ProjectsMetadataRepository {
  getMetadata(): Promise<ProjectsMetadata>;
}

export interface ProjectsBasicMetadataRepository {
  getBasicMetadata(): Promise<ProjectsBasicMetadata>;
}

export interface ProjectsCitiesMetadataRepository {
  getCitiesMetadata(): Promise<ProjectsCitiesMetadata>;
}

export interface ProjectsImageTypesMetadataRepository {
  getImageTypes(): Promise<ImageType[]>;
}

export interface CreateProjectMediaRepository {
  createMany(media: ProjectMediaInput[]): Promise<void>;
}

export interface UpdateProjectMediaRepository {
  updateMany(media: ProjectMediaInput[]): Promise<void>;
}

export interface DeleteProjectMediaRepository {
  deleteMany(mediaIds: number[]): Promise<void>;
}

export interface CompanyProjectsRepository {
  getCompanyProjects(limit: number): Promise<ProjectView[]>;
}

export interface RealEstateProjectsRepository {
  getRealEstateProjects(limit: number): Promise<ProjectView[]>;
}
