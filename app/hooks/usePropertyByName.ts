"use client";

import { useEffect, useState } from "react";
import { Property } from "@/lib/definitios";

export function usePropertyByName(name: string) {
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/properties/${name}`);
        
        if (!response.ok) {
          throw new Error("Propiedad no encontrada");
        }

        const data = await response.json();
        setProperty(data);
        setError(null);
      } catch (error) {
        setError(error instanceof Error ? error.message : "Error desconocido");
        setProperty(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProperty();
  }, [name]);

  return { property, loading, error };
}
