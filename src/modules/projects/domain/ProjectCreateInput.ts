export interface ProjectCreateInput {
  name: string;
  price?: number | null;
  builtArea: number;
  totalArea: number;

  freeHeight?: number | null;
  width?: number | null;
  length?: number | null;

  parkingSpots?: number;
  elevator?: boolean;
  heavyParking?: number | null;
  availableUnits?: number;

  bedrooms?: number | null;
  bathrooms?: number;
  lobbies?: number;

  towers?: number | null;
  storageUnits?: number | null;

  socioeconomicLevel?: number | null;
  floorNumber?: number | null;
  yearBuilt?: number | null;

  customizationOptions?: boolean;
  terrace?: boolean | null;
  balcony?: boolean;
  garden?: boolean | null;
  laundryArea?: boolean;

  complexName?: string | null;
  shortDescription: string;
  detailedDescription: string;

  address: string;
  latitude: number;
  longitude: number;
  availableDate?: string | Date | null;

  propertyTypeId: number;
  housingTypeId?: number | null;
  cityId: number;
  membershipId?: number;
  projectTypeId: number;
  statusProjectId?: number | null;

  commonAreaIds?: number[] | null;
  nearbyServiceIds?: number[] | null;

  ownerId?: number | null;
}
