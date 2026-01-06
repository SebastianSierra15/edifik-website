import { BadRequestError } from "@/src/shared";
import { PropertySearchRepository } from "../domain/PropertySearchRepository";
import { PropertySearchFilters } from "../domain/PropertySearchFilters";

const parseNumberArray = (value?: string | null): number[] | null => {
  if (!value) return null;

  const parsed = value
    .split(",")
    .map((v) => Number(v))
    .filter((v) => !Number.isNaN(v));

  return parsed.length ? parsed : null;
};

export class SearchProperties {
  constructor(private readonly repo: PropertySearchRepository) {}

  async execute(filters: PropertySearchFilters) {
    if (filters.page < 1) {
      throw new BadRequestError("Parámetro page inválido");
    }

    if (filters.pageSize < 1) {
      throw new BadRequestError("Parámetro pageSize inválido");
    }

    return this.repo.search({
      ...filters,
      cities: parseNumberArray(filters.cities),
      propertyTypes: parseNumberArray(filters.propertyTypes),
      housingTypes: parseNumberArray(filters.housingTypes),
      commonAreas: parseNumberArray(filters.commonAreas),
      nearbyServices: parseNumberArray(filters.nearbyServices),
    });
  }
}
