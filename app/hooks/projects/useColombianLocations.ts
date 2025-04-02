import { useEffect, useState } from "react";

interface Departament {
  id: number;
  name: string;
}

interface City {
  id: number;
  name: string;
  departamentId: number;
}

interface ColombianLocations {
  departaments: Departament[];
  cities: Record<number, City[]>;
}

export default function useColombianLocations() {
  const [locations, setLocations] = useState<ColombianLocations>({
    departaments: [],
    cities: {},
  });

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const response = await fetch(
          "https://raw.githubusercontent.com/marcovega/colombia-json/master/colombia.min.json"
        );

        const data = await response.json();

        const departaments: Departament[] = data.map(
          (dept: any, index: number) => ({
            id: index + 1,
            name: dept.departamento,
          })
        );

        const cities = data.reduce(
          (acc: Record<number, City[]>, dept: any, index: number) => {
            acc[index + 1] = dept.ciudades.map(
              (cityName: string, cityIndex: number) => ({
                id: cityIndex + 1,
                name: cityName,
                departamentId: index + 1,
              })
            );
            return acc;
          },
          {}
        );

        setLocations({ departaments, cities });
      } catch (error) {
        console.error("Error al cargar los departamentos y ciudades:", error);
      }
    };

    fetchLocations();
  }, []);

  return locations;
}
