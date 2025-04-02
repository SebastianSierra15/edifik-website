import { useState, useEffect, useMemo, useCallback } from "react";
import {
  City,
  CommonArea,
  HousingType,
  NearbyService,
  propertyType,
  MembershipSummary,
} from "@/lib/definitios";

type Metadata = {
  cities: City[];
  commonAreas: CommonArea[];
  housingTypes: HousingType[];
  nearbyServices: NearbyService[];
  propertyTypes: propertyType[];
  memberships: MembershipSummary[];
};

export const useProjectsMetadata = () => {
  const [metadata, setMetadata] = useState<Metadata>({
    cities: [],
    commonAreas: [],
    housingTypes: [],
    nearbyServices: [],
    propertyTypes: [],
    memberships: [],
  });
  const [isLoadingMetadata, setIsLoadingMetadata] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMetadata = useCallback(async () => {
    if (metadata.cities.length > 0) return;

    setIsLoadingMetadata(true);
    setError(null);

    try {
      const response = await fetch("/api/projects/metadata");

      if (!response.ok) {
        throw new Error(`Error fetching metadata: ${response.statusText}`);
      }

      const data = await response.json();
      setMetadata(data);
    } catch (err) {
      console.error("Error fetching metadata:", err);
      setError((err as Error).message || "Error desconocido");
    } finally {
      setIsLoadingMetadata(false);
    }
  }, [metadata]);

  useEffect(() => {
    fetchMetadata();
  }, [fetchMetadata]);

  const memoizedMetadata = useMemo(() => metadata, [metadata]);

  return { metadata: memoizedMetadata, isLoadingMetadata, error };
};
