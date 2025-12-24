"use client";

import { FormSearchAddress } from "@/src/components/shared";
import { LocationMap } from "../LocationMap";

interface LocationMapSectionProps {
  mapAddress: string;
  isMapsReady: boolean;
  onMapAddressChange: (value: string) => void;
  onAddressSelect: (placeId: string, description: string) => void;
  onLocationSelect: (coords: {
    lat: number;
    lng: number;
    address?: string;
    city?: string;
    department?: string;
  }) => void;
  coordinates: { lat: number; lng: number };
  label: string;
  error?: string;
  tooltipText: string;
}

export function LocationMapSection({
  mapAddress,
  isMapsReady,
  onMapAddressChange,
  onAddressSelect,
  onLocationSelect,
  coordinates,
  label,
  error,
  tooltipText,
}: LocationMapSectionProps) {
  return (
    <>
      <div className="relative z-20 space-y-4">
        <FormSearchAddress
          label={label}
          value={mapAddress || ""}
          onChange={onMapAddressChange}
          onSelect={onAddressSelect}
          error={error}
          isLoaded={isMapsReady}
          tooltipText={tooltipText}
        />
      </div>

      <div className="relative h-64 w-full">
        <LocationMap
          isLoaded={isMapsReady}
          coordinates={coordinates}
          onLocationSelect={onLocationSelect}
          showUserLocationButton={true}
        />
      </div>
    </>
  );
}
