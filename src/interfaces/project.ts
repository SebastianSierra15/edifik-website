export interface ProjectMedia {
  url: string;
  tag: string;
  projectId: number;
}

export interface ProjectCity {
  id: number;
  name: string;
  departament: {
    id: number;
    name: string;
  };
}

/**
 * Vista resumida de proyectos (listas, grids)
 */
export interface ProjectSummary {
  id: number;
  name: string;
  price: number | null;
  totalArea: number;
  bedrooms: number | null;
  bathrooms: number | null;
  parkingSpots: number | null;
  address: string;
  longitude: number;
  latitude: number;
  city: ProjectCity;
  projectMedia: ProjectMedia[];
}
