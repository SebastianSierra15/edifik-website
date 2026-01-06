import { apiClient } from "@/src/lib";

export interface NominatimSearchResult {
  place_id: number | string;
  display_name: string;
  lat: string;
  lon: string;
}

export interface NominatimSearchParams {
  query: string;
  limit?: number;
  countryCodes?: string;
  language?: string;
}

export class NominatimService {
  static async search(
    params: NominatimSearchParams
  ): Promise<NominatimSearchResult[]> {
    const url = new URL("https://nominatim.openstreetmap.org/search");
    const limit = params.limit ?? 5;
    const countryCodes = params.countryCodes ?? "co";
    const language = params.language ?? "es-CO";

    url.searchParams.set("format", "json");
    url.searchParams.set("q", params.query);
    url.searchParams.set("addressdetails", "1");
    url.searchParams.set("limit", limit.toString());
    url.searchParams.set("countrycodes", countryCodes);

    return apiClient.get<NominatimSearchResult[]>(url.toString(), {
      credentials: "omit",
      headers: {
        "Accept-Language": language,
      },
    });
  }
}
