"use client";

import { useCallback } from "react";

interface GeocoderResult {
  address: string;
  city: string;
  department: string;
}

const resolveCityDepartment = (results: google.maps.GeocoderResult[]) => {
  let cityName =
    results
      .find((result) => result.types.includes("locality"))
      ?.formatted_address.split(",")[0]
      .trim() || "";
  let departmentName =
    results
      .find((result) => result.types.includes("administrative_area_level_1"))
      ?.formatted_address.split(",")[0]
      .trim() || "";

  if (cityName && departmentName) {
    return { cityName, departmentName };
  }

  results.forEach((result) => {
    result.address_components.forEach((component) => {
      if (!cityName && component.types.includes("locality")) {
        cityName = component.long_name;
      }
      if (
        !departmentName &&
        component.types.includes("administrative_area_level_1")
      ) {
        departmentName = component.long_name;
      }
    });
  });

  if (!cityName || !departmentName) {
    results.forEach((result) => {
      result.address_components.forEach((component) => {
        if (!cityName && component.types.includes("sublocality")) {
          cityName = component.long_name;
        }
        if (!departmentName && component.types.includes("political")) {
          departmentName = component.long_name;
        }
      });
    });
  }

  return { cityName, departmentName };
};

export function useLocationGeocoder() {
  const resolveLocation = useCallback(
    async (coords: { lat: number; lng: number }) => {
      if (typeof window === "undefined" || !google?.maps) {
        return null;
      }

      const geocoder = new google.maps.Geocoder();

      return new Promise<GeocoderResult | null>((resolve) => {
        geocoder.geocode({ location: coords }, (results, status) => {
          if (
            status !== google.maps.GeocoderStatus.OK ||
            !results ||
            results.length === 0
          ) {
            resolve(null);
            return;
          }

          const formattedAddress = results[0].formatted_address;
          const { cityName, departmentName } =
            resolveCityDepartment(results);

          resolve({
            address: formattedAddress,
            city: cityName,
            department: departmentName,
          });
        });
      });
    },
    []
  );

  return { resolveLocation };
}
