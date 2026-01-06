export interface PropertySearchQuery {
  page: number;
  pageSize: number;

  cities?: number[] | null;
  propertyTypes?: number[] | null;
  housingTypes?: number[] | null;
  commonAreas?: number[] | null;
  nearbyServices?: number[] | null;

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
