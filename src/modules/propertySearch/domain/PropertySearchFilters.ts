export interface PropertySearchFilters {
  page: number;
  pageSize: number;

  cities?: string | null;
  propertyTypes?: string | null;
  housingTypes?: string | null;
  commonAreas?: string | null;
  nearbyServices?: string | null;

  price?: number | null;
  area?: string | null;
  bedrooms?: string | null;
  bathrooms?: string | null;
  lobbies?: string | null;

  projectTypeId: number;

  minLat?: number | null;
  maxLat?: number | null;
  minLng?: number | null;
  maxLng?: number | null;

  latitude?: number | null;
  longitude?: number | null;
}
