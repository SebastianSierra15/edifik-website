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
  email?: string | null;
  projectMedia: ProjectMedia[];
}

export interface ProjectView {
  id: number;
  name: string;
  cityName: string;
  price?: number;
  area?: number;
  bathrooms?: number;
  parkingSpots?: number;
  bedrooms?: number;
  longitude?: number;
  latitude?: number;
  images: {
    url: string;
    tag: string;
    projectId: number;
  }[];
}

export interface ProjectOwner {
  id: number;
  names: string;
  lastnames: string;
  email: string;
  phoneNumber: string | null;
}

export interface ProjectDetails {
  id: number;
  name: string;
  state: boolean;

  price: number | null;
  totalArea: number;
  builtArea: number;

  freeHeight?: number | null;
  width?: number | null;
  length?: number | null;

  parkingSpots?: number | null;
  elevator?: boolean | null;
  heavyParking?: boolean | null;
  availableUnits?: number | null;

  bathrooms?: number | null;
  bedrooms?: number | null;
  lobbies?: number | null;
  towers?: number | null;
  storageUnits?: number | null;

  socioeconomicLevel?: number | null;
  floorNumber?: number | null;
  yearBuilt?: number | null;

  customizationOptions?: boolean | null;
  terrace?: boolean | null;
  balcony?: boolean | null;
  garden?: boolean | null;
  laundryArea?: boolean | null;

  complexName?: string | null;
  shortDescription?: string | null;
  detailedDescription?: string | null;

  address: string;
  latitude: number;
  longitude: number;
  availableDate?: Date;

  propertyType: {
    id: number;
    name: string;
  };

  projectType: {
    id: number;
    name: string;
  };

  housingType: {
    id: number;
    name: string;
  };

  city: ProjectCity;

  membership: string;

  statusProject: {
    id: number;
    name: string;
  };

  ownerId: number;
  email: string;
  phoneNumber?: string | null;

  residentialProjectId?: number | null;
  warehouseProjectId?: number | null;

  commonAreas: {
    id: number;
    name: string;
  }[];

  nearbyServices: {
    id: number;
    name: string;
  }[];

  projectMedia: ProjectMedia[];
}
