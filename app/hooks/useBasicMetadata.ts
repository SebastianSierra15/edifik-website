import { useEffect, useState } from "react";
import {
  CommonArea,
  HousingType,
  NearbyService,
  PropertyType,
  Category,
} from "@/lib/definitios";

interface BasicMetadata {
  commonAreas: CommonArea[];
  housingTypes: HousingType[];
  nearbyServices: NearbyService[];
  propertyTypes: PropertyType[];
  categories: Category[];
}

export default function useBasicMetadata() {
  const [metadata, setMetadata] = useState<BasicMetadata | null>(null);
  const [loadingMetadata, setLoadingMetadata] = useState<boolean>(true);
  const [errorMetadata, setErrorMetadata] = useState<string | null>(null);

  useEffect(() => {
    const fetchMetadata = async () => {
      try {
        const response = await fetch("/api/properties/metadata/basic-metadata");
        if (!response.ok) throw new Error("Error al obtener los datos");

        const data: BasicMetadata = await response.json();
        setMetadata(data);
      } catch (err: any) {
        setErrorMetadata(err.message || "Error desconocido");
      } finally {
        setLoadingMetadata(false);
      }
    };

    fetchMetadata();
  }, []);

  return { metadata, loadingMetadata, errorMetadata };
}
