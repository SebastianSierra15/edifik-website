import { useEffect, useState } from "react";
import axios from "axios";
import {
  CommonArea,
  HousingType,
  NearbyService,
  propertyType,
  Category,
} from "@/lib/definitios";

interface BasicMetadata {
  commonAreas: CommonArea[];
  housingTypes: HousingType[];
  nearbyServices: NearbyService[];
  propertyTypes: propertyType[];
  categories: Category[];
}

export default function useBasicMetadata() {
  const [metadata, setMetadata] = useState<BasicMetadata | null>(null);
  const [loadingMetadata, setLoadingMetadata] = useState<boolean>(true);
  const [errorMetadata, setErrorMetadata] = useState<string | null>(null);

  useEffect(() => {
    const fetchMetadata = async () => {
      try {
        const response = await axios.get<BasicMetadata>(
          "/api/projects/metadata/basic-metadata"
        );
        setMetadata(response.data);
      } catch (err: any) {
        setErrorMetadata(
          err.response?.data?.message || err.message || "Error desconocido"
        );
      } finally {
        setLoadingMetadata(false);
      }
    };

    fetchMetadata();
  }, []);

  return { metadata, loadingMetadata, errorMetadata };
}
