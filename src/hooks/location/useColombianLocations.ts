"use client";

import { useEffect, useState } from "react";

export interface ColombianCity {
  id: number;
  name: string;
}

export interface ColombianDepartment {
  id: number;
  name: string;
  cities: ColombianCity[];
}

export function useColombianLocations() {
  const [departments, setDepartments] = useState<ColombianDepartment[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLocations = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch(
          "https://raw.githubusercontent.com/marcovega/colombia-json/master/colombia.min.json"
        );

        if (!response.ok) {
          throw new Error("No se pudo cargar la información de Colombia");
        }

        const data: ColombianDepartment[] = await response.json();
        setDepartments(data);
      } catch (err: unknown) {
        setError(
          err instanceof Error ? err.message : "Error al cargar departamentos"
        );
        setDepartments([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLocations();
  }, []);

  return {
    departments,
    isLoading,
    error,
  };
}
