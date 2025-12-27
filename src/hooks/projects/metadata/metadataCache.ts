import type {
  ImageType,
  ProjectsBasicMetadata,
  ProjectsCitiesMetadata,
  ProjectsMetadata,
} from "@/src/interfaces";
import { ProjectMetadataService } from "@/src/services/projects";

let projectsMetadataCache: ProjectsMetadata | null = null;
let projectsMetadataPromise: Promise<ProjectsMetadata> | null = null;

let basicMetadataCache: ProjectsBasicMetadata | null = null;
let basicMetadataPromise: Promise<ProjectsBasicMetadata> | null = null;

let locationsMetadataCache: ProjectsCitiesMetadata | null = null;
let locationsMetadataPromise: Promise<ProjectsCitiesMetadata> | null = null;

let imageTypesCache: ImageType[] | null = null;
let imageTypesPromise: Promise<ImageType[]> | null = null;

export function getCachedProjectsMetadata() {
  return projectsMetadataCache;
}

export function fetchProjectsMetadata(): Promise<ProjectsMetadata> {
  if (projectsMetadataCache) {
    return Promise.resolve(projectsMetadataCache);
  }

  if (!projectsMetadataPromise) {
    projectsMetadataPromise = ProjectMetadataService.getAll()
      .then((data) => {
        projectsMetadataCache = data;
        return data;
      })
      .finally(() => {
        projectsMetadataPromise = null;
      });
  }

  return projectsMetadataPromise;
}

export function getCachedBasicMetadata() {
  return basicMetadataCache;
}

export function fetchBasicMetadata(): Promise<ProjectsBasicMetadata> {
  if (basicMetadataCache) {
    return Promise.resolve(basicMetadataCache);
  }

  if (!basicMetadataPromise) {
    basicMetadataPromise = ProjectMetadataService.getBasic()
      .then((data) => {
        basicMetadataCache = data;
        return data;
      })
      .finally(() => {
        basicMetadataPromise = null;
      });
  }

  return basicMetadataPromise;
}

export function getCachedLocationsMetadata() {
  return locationsMetadataCache;
}

export function fetchLocationsMetadata(): Promise<ProjectsCitiesMetadata> {
  if (locationsMetadataCache) {
    return Promise.resolve(locationsMetadataCache);
  }

  if (!locationsMetadataPromise) {
    locationsMetadataPromise = ProjectMetadataService.getCities()
      .then((data) => {
        locationsMetadataCache = data;
        return data;
      })
      .finally(() => {
        locationsMetadataPromise = null;
      });
  }

  return locationsMetadataPromise;
}

export function getCachedImageTypes() {
  return imageTypesCache;
}

export function fetchImageTypes(): Promise<ImageType[]> {
  if (imageTypesCache) {
    return Promise.resolve(imageTypesCache);
  }

  if (!imageTypesPromise) {
    imageTypesPromise = ProjectMetadataService.getImageTypes()
      .then((data) => {
        imageTypesCache = data ?? [];
        return imageTypesCache;
      })
      .finally(() => {
        imageTypesPromise = null;
      });
  }

  return imageTypesPromise;
}
