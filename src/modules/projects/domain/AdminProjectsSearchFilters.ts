export interface AdminProjectsSearchFilters {
  page: number;
  pageSize: number;
  searchTerm?: string | null;

  price?: number | null;
  area?: number | null;
  bedrooms?: number | null;
  bathrooms?: number | null;
  lobbies?: number | null;

  projectTypeId: number;

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
