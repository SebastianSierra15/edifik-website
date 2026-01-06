export interface City {
  id: number;
  name: string;
  departament: {
    id: number;
    name: string;
  };
}

export interface SimpleCatalog {
  id: number;
  name: string;
}

export interface ProjectsMetadata {
  cities: City[];
  commonAreas: SimpleCatalog[];
  housingTypes: SimpleCatalog[];
  nearbyServices: SimpleCatalog[];
  propertyTypes: SimpleCatalog[];
  memberships: SimpleCatalog[];
}

export interface ProjectsBasicMetadata {
  commonAreas: SimpleCatalog[];
  housingTypes: SimpleCatalog[];
  nearbyServices: SimpleCatalog[];
  propertyTypes: SimpleCatalog[];
}

export interface Departament {
  id: number;
  name: string;
}

export interface City {
  id: number;
  name: string;
  departament: Departament;
}

export interface ProjectsCitiesMetadata {
  departaments: Departament[];
  cities: City[];
}

export interface ImageType {
  id: number;
  name: string;
  description: string | null;
  maxImagesAllowed: number;
  isRequired: boolean;
}
