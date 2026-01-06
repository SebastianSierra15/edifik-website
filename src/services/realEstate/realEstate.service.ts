import { apiClient } from "@/src/lib";
import { ProjectView } from "@/src/interfaces";

export interface SearchPropertiesParams {
  page: number;
  pageSize: number;

  selectedButtons: Record<string, number[]>;
  projectTypeId: number | null;

  bounds?: {
    minLat: number;
    maxLat: number;
    minLng: number;
    maxLng: number;
  };

  searchCoords?: {
    latitude: number;
    longitude: number;
  } | null;
}

export interface SearchPropertiesResponse {
  projects: ProjectView[];
  totalEntries: number;
}

export class RealEstateService {
  static async searchProperties(
    params: SearchPropertiesParams
  ): Promise<SearchPropertiesResponse> {
    const query = new URLSearchParams({
      page: params.page.toString(),
      pageSize: params.pageSize.toString(),
      ...(params.projectTypeId
        ? { projectTypeId: params.projectTypeId.toString() }
        : {}),
    });

    // filtros dinámicos
    Object.entries(params.selectedButtons).forEach(([key, values]) => {
      if (values.length > 0) {
        query.append(key, values.join(","));
      }
    });

    // mapa
    if (params.bounds) {
      query.append("minLat", params.bounds.minLat.toString());
      query.append("maxLat", params.bounds.maxLat.toString());
      query.append("minLng", params.bounds.minLng.toString());
      query.append("maxLng", params.bounds.maxLng.toString());
    }

    // búsqueda puntual
    if (params.searchCoords) {
      query.append("latitude", params.searchCoords.latitude.toString());
      query.append("longitude", params.searchCoords.longitude.toString());
    }

    return apiClient.get<SearchPropertiesResponse>(
      `/api/realEstate?${query.toString()}`
    );
  }
}
