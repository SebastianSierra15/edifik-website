import { useEffect, useState } from "react";

export default function useColombianLocations() {
  const [locations, setLocations] = useState([]);

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const response = await fetch(
          "https://raw.githubusercontent.com/marcovega/colombia-json/master/colombia.min.json"
        );
        const data = await response.json();
        setLocations(data);
      } catch (error) {
        console.error("Error al cargar los departamentos y ciudades:", error);
      }
    };

    fetchLocations();
  }, []);

  return locations;
}
