"use client";

import { useCallback } from "react";

interface GeocoderResult {
  address: string;
  city: string;
  department: string;
}

interface NominatimResponse {
  display_name?: string;
  address?: {
    city?: string;
    town?: string;
    village?: string;
    county?: string;
    state?: string;
    region?: string;
  };
}

export function useLocationGeocoder() {
  const resolveLocation = useCallback(
    async (coords: { lat: number; lng: number }) => {
      try {
        const params = new URLSearchParams({
          format: "json",
          lat: String(coords.lat),
          lon: String(coords.lng),
          addressdetails: "1",
        });

        const response = await fetch(
          `https://nominatim.openstreetmap.org/reverse?${params.toString()}`
        );

        if (!response.ok) {
          return null;
        }

        const data = (await response.json()) as NominatimResponse;
        const addressInfo = data.address ?? {};
        const city =
          addressInfo.city ||
          addressInfo.town ||
          addressInfo.village ||
          addressInfo.county ||
          "";
        const department = addressInfo.state || addressInfo.region || "";

        return {
          address: data.display_name || "",
          city,
          department,
        };
      } catch (error) {
        console.warn("[Nominatim] Error resolving location", error);
        return null;
      }
    },
    []
  );

  return { resolveLocation };
}
