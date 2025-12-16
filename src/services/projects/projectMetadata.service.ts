import { apiClient } from "@/src/lib";
import {
  ProjectsMetadata,
  ProjectsBasicMetadata,
  ProjectsCitiesMetadata,
  ImageType,
} from "@/src/interfaces";

export class ProjectMetadataService {
  static getAll(): Promise<ProjectsMetadata> {
    return apiClient.get("/api/projects/metadata");
  }

  static getBasic(): Promise<ProjectsBasicMetadata> {
    return apiClient.get("/api/projects/metadata/basic-metadata");
  }

  static getCities(): Promise<ProjectsCitiesMetadata> {
    return apiClient.get("/api/projects/metadata/cities");
  }

  static getImageTypes(): Promise<ImageType[]> {
    return apiClient.get("/api/projects/metadata/image-types");
  }
}
