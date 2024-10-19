import { useEffect, useState } from "react";
import {
  CommonArea,
  HousingType,
  NearbyService,
  PropertyType,
} from "@/lib/definitios";

interface BasicMetadata {
  commonAreas: CommonArea[];
  housingTypes: HousingType[];
  nearbyServices: NearbyService[];
  propertyTypes: PropertyType[];
}

export default function useBasicMetadata() {
  const [metadata, setMetadata] = useState<BasicMetadata | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMetadata = async () => {
      try {
        const response = await fetch("/api/properties/metadata/basicMetadata");
        if (!response.ok) throw new Error("Error al obtener los datos");

        const data: BasicMetadata = await response.json();
        setMetadata(data);
      } catch (err: any) {
        setError(err.message || "Error desconocido");
      } finally {
        setLoading(false);
      }
    };

    fetchMetadata();
  }, []);

  return { metadata, loading, error };
}
