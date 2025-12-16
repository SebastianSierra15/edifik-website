export interface AdminProjectsSearchFilters {
  page: number;
  pageSize: number;

  searchTerm?: string | null;
  projectTypeId: number;

  price?: number | null;
  area?: string | null;
  bedrooms?: string | null;
  bathrooms?: string | null;
  lobbies?: string | null;

  minLat?: number | null;
  maxLat?: number | null;
  minLng?: number | null;
  maxLng?: number | null;

  cities?: number[] | null;
  propertyTypes?: number[] | null;
  housingTypes?: number[] | null;
  memberships?: number[] | null;
  commonAreas?: number[] | null;
  nearbyServices?: number[] | null;
}
