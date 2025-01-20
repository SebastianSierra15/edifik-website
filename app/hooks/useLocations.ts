import { useEffect, useState } from "react";
import axios from "axios";
import { City, Departament } from "@/lib/definitios";

interface LocationsData {
  departaments: Departament[];
  cities: City[];
}

export default function useLocations() {
  const [locations, setLocations] = useState<LocationsData | null>(null);
  const [loadingLocations, setLoadingLocations] = useState<boolean>(true);
  const [errorLocations, setErrorLocations] = useState<string | null>(null);

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const response = await axios.get("/api/projects/metadata/cities");
        setLocations(response.data);
      } catch (err: any) {
        setErrorLocations(
          err.response?.data?.message || err.message || "Unknown error",
        );
      } finally {
        setLoadingLocations(false);
      }
    };

    fetchLocations();
  }, []);

  return { locations, loadingLocations, errorLocations };
}
